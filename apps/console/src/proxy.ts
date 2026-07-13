import { httpAuth } from "@ssurak/api/core/auth/httpAuth";
import parseCookieFromResponse from "@ssurak/api/utils/parseCookieFromResponse";
import { isExpired } from "@ssurak/auth/utils/decodedToken";
import { COOKIE_TABLE } from "@ssurak/api/utils/cookieTable.const";
import { NextRequest, NextResponse } from "next/server";
import { cookieOptions } from "../utils/cookieOptions";

export async function proxy(req: NextRequest) {
  const refreshToken = req.cookies.get(COOKIE_TABLE.REFRESH);
  const accessToken = req.cookies.get(COOKIE_TABLE.ACCESS_TOKEN);

  if (!refreshToken || isExpired(refreshToken?.value)) {
    console.log("[proxy] expired refresh token go to signin...");
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (!accessToken || isExpired(accessToken?.value)) {
    console.log("[proxy] refresh access token...");
    try {
      const refreshed = await httpAuth.refreshAccessToken(refreshToken.value);
      const res = NextResponse.next();

      const setCookieHeader = refreshed.headers["set-cookie"];
      if (setCookieHeader) {
        for (const { name, value, expires } of parseCookieFromResponse(
          setCookieHeader
        )) {
          res.cookies.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            ...cookieOptions,
            expires,
          });
        }
      }

      return res;
    } catch {
      console.error("[proxy] failed to refresh access token");
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/stores/:path*"],
};
