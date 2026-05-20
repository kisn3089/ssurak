"use server";

import {
  createSessionSchema,
  httpSession,
  setCookieFromResponseHeader,
} from "@spaceorder/api";
import parseCookieFromResponse from "@spaceorder/api/utils/parseCookieFromResponse";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

type CreateSessionResult =
  | { success: true; data: { sessionToken: string } }
  | { success: false; error: { status?: number; message: string } };

export default async function createSession(
  qrCode: string
): Promise<CreateSessionResult> {
  try {
    const { qrCode: validatedQrCode } = createSessionSchema.parse({ qrCode });
    const token = await httpSession.createSession(validatedQrCode);

    const cookieFromResponseHeader = token.headers["set-cookie"];
    if (cookieFromResponseHeader) {
      const responseCookies = parseCookieFromResponse(cookieFromResponseHeader);

      await setCookieFromResponseHeader(
        responseCookies,
        async ({ name, value, expires, path }) => {
          const cookieStore = await cookies();
          cookieStore.set(name, value, {
            path: path ?? "/",
            expires,
          });
        }
      );
    }

    return { success: true, data: token.data };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: {
          status: error.response?.status,
          message: error.response?.data?.message ?? error.message,
        },
      };
    }
    throw error;
  }
}
