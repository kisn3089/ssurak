import { COOKIE_TABLE } from "@spaceorder/db/constants";
import { CookieOptions, Response } from "express";

const isProd = process.env.NODE_ENV === "production";

/**
 * 운영에선 프론트(order/console)와 api 가 같은 등록가능도메인의 서브도메인이므로,
 * COOKIE_DOMAIN(예: ".hanco.net")을 설정해 쿠키를 서브도메인 간 공유한다.
 * 그러면 order.<domain> → api.<domain> 요청이 same-site 가 되어, SameSite=Lax 로도
 * 모든 브라우저(Safari 포함)에서 쿠키가 전송된다. 로컬(localhost)에선 비워 둔다.
 */
const cookieDomain = isProd ? process.env.COOKIE_DOMAIN : undefined;

const baseCookieOptions: Pick<
  CookieOptions,
  "httpOnly" | "sameSite" | "secure" | "domain"
> = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

function set(
  response: Response,
  name: (typeof COOKIE_TABLE)[keyof typeof COOKIE_TABLE],
  value: string,
  cookieOptions: Omit<CookieOptions, "httpOnly" | "sameSite" | "secure">
) {
  return response.cookie(name, value, {
    ...baseCookieOptions,
    ...cookieOptions,
  });
}

function remove(
  response: Response,
  name: (typeof COOKIE_TABLE)[keyof typeof COOKIE_TABLE],
  cookieOptions: Omit<CookieOptions, "httpOnly" | "sameSite" | "secure">
) {
  return response.clearCookie(name, {
    ...baseCookieOptions,
    ...cookieOptions,
  });
}

export const responseCookie = {
  set,
  remove,
};
