import axios, { AxiosError, AxiosRequestConfig } from "axios";

const isServer = typeof window === "undefined";

export const resolveOrderhubBaseURL = (): string => {
  if (process.env.NODE_ENV !== "production") {
    // dev SSR: 서버→백엔드 내부 통신. docker dev에서는 compose DNS(ssurack:8080)로
    // 주입되고, 호스트 dev에서는 미설정이라 localhost로 폴백. 브라우저용이 아니므로
    // NEXT_PUBLIC_ 접두사를 쓰지 않는다(클라이언트 번들에 인라인되지 않음).
    if (isServer) {
      return process.env.ORDERHUB_INTERNAL_URL || "http://localhost:8080";
    }
    // dev 브라우저: 호스트에서 접근하므로 현재 호스트명 기준으로 해석.
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  // prod: 브라우저 클라이언트용 공개 URL.
  return process.env.NEXT_PUBLIC_API_SSURACK_URL || "http://localhost:8080";
};

export const http = axios.create({
  baseURL: resolveOrderhubBaseURL(),
  timeout: 10000,
  withCredentials: true,
});

/** 서버 사이드에서 실행하지 말것 */
export function updateAxiosAuthorizationHeader(token: string) {
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

type AxiosCustomError = {
  errorCode: number;
  message: string;
  status: number;
};

type AuthCallbacks = {
  refreshAccessToken: () => Promise<{ accessToken: string }>;
  setAuthInfo: (authInfo: { accessToken: string }) => void;
  signOut: () => void;
  forbiddenNotice: () => void;
};

let authCallbacks: AuthCallbacks | null = null;

export function setupAuthInterceptor(callbacks: AuthCallbacks) {
  authCallbacks = callbacks;
}

let refreshPromise: Promise<{ accessToken: string }> | null = null;

function refreshAccessTokenOnce(
  callbacks: AuthCallbacks
): Promise<{ accessToken: string }> {
  if (!refreshPromise) {
    refreshPromise = callbacks.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

http.interceptors.response.use(
  undefined,
  async (error: AxiosError<AxiosCustomError, AxiosRequestConfig>) => {
    if (error instanceof AxiosError && error.config) {
      if (error.response?.status === 419 && authCallbacks) {
        try {
          const newAccessToken = await refreshAccessTokenOnce(authCallbacks);

          authCallbacks.setAuthInfo({
            accessToken: newAccessToken.accessToken,
          });
          updateAxiosAuthorizationHeader(newAccessToken.accessToken);

          error.config.headers["Authorization"] =
            `Bearer ${newAccessToken.accessToken}`;
          return http(error.config);
        } catch {
          authCallbacks?.signOut();
        }
      }

      if (
        error.response?.status === 403 &&
        !error.config.url?.includes("/refresh") &&
        authCallbacks
      ) {
        authCallbacks.forbiddenNotice();
      }
    }

    return Promise.reject(error);
  }
);
