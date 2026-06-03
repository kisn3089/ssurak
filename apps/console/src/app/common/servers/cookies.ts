"use server";

import { COOKIE_TABLE } from "@spaceorder/db/constants";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

type CookieKey = (typeof COOKIE_TABLE)[keyof typeof COOKIE_TABLE];

export async function getServerCookie(name: CookieKey) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function setServerCookie(
  name: CookieKey,
  value: string,
  options?: Pick<ResponseCookie, "path" | "maxAge" | "expires">
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    path: options?.path ?? "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
    ...options,
  });
}

export async function clearServerCookie(name: CookieKey) {
  const cookieStore = await cookies();
  cookieStore.delete({
    name,
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });
}
