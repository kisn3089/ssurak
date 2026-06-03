"use server";

import { AxiosError } from "axios";
import { AccessToken, httpAuth } from "@spaceorder/api";
import parseCookieFromResponse, {
  setCookieFromResponseHeader,
} from "@spaceorder/api/utils/parseCookieFromResponse";
import { setServerCookie } from "@/app/common/servers/cookies";

type ActionResponse =
  | {
      success: true;
      data: AccessToken;
    }
  | {
      success: false;
      error: {
        message: string;
        statusCode?: number;
      };
    };

export default async function signInAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return {
        success: false,
        error: { message: "이메일과 비밀번호를 모두 입력해주세요." },
      };
    }

    const createdAccessToken = await httpAuth.createAccessToken(
      {
        email,
        password,
      },
      "owner"
    );

    const cookieFromResponseHeader = createdAccessToken.headers["set-cookie"];
    if (cookieFromResponseHeader) {
      const responseCookies = parseCookieFromResponse(cookieFromResponseHeader);
      await setCookieFromResponseHeader(
        responseCookies,
        async ({ name, value, expires }) => {
          await setServerCookie(name, value, { expires });
        }
      );
    }

    return {
      success: true,
      data: createdAccessToken.data,
    };
  } catch (error) {
    const errorResponse: ActionResponse = {
      success: false,
      error: { message: "로그인 시 서버 오류가 발생했습니다." },
    };

    console.log(JSON.stringify(error));

    if (error instanceof AxiosError) {
      if (error.response?.data?.statusCode === 401) {
        errorResponse["error"].message =
          error.response?.data?.message ||
          "이메일 또는 비밀번호가 올바르지 않습니다.";
        return errorResponse;
      }
      return errorResponse;
    }
    return errorResponse;
  }
}
