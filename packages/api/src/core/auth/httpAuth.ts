import { AxiosResponse } from "axios";
import { http } from "../axios/http";
import { AccessToken, SignInPayload } from "./auth.type";
import type { TokenPayload } from "@ssurak/auth/types/token.interface";
import { COOKIE_TABLE } from "../../utils/cookieTable.const";

const prefix = "/auth/v1";

async function createAccessToken(
  signInPayload: SignInPayload,
  role: TokenPayload["role"]
): Promise<AxiosResponse<AccessToken>> {
  const response = await http.post<AccessToken>(
    `${prefix}/${role}/signin`,
    signInPayload
  );
  return response;
}

async function refreshAccessToken(
  refreshToken?: string
): Promise<AxiosResponse<AccessToken>> {
  const response = await http.post<AccessToken>(
    `${prefix}/refresh`,
    {},
    refreshToken
      ? {
          headers: {
            Cookie: `${COOKIE_TABLE.REFRESH}=${refreshToken}`,
          },
        }
      : {}
  );
  return response;
}

export const httpAuth = { createAccessToken, refreshAccessToken };
