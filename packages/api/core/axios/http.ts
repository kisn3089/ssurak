import axios, { AxiosError, AxiosRequestConfig } from "axios";

const isServer = typeof window === "undefined";

export const resolveOrderhubBaseURL = (): string => {
  if (process.env.NODE_ENV !== "production") {
    if (isServer) {
      return process.env.ORDERHUB_INTERNAL_URL || "http://localhost:8080";
    }
    // dev 브라우저: 호스트에서 접근하므로 현재 호스트명 기준으로 해석.
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return process.env.NEXT_PUBLIC_API_SSURAK_URL || "http://localhost:8080";
};

export const http = axios.create({
  baseURL: resolveOrderhubBaseURL(),
  timeout: 10000,
  withCredentials: true,
});

/** 서버 사이드에서 실행하지 말 것 */
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
