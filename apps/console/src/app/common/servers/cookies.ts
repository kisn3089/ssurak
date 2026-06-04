"use server";

import { COOKIE_TABLE } from "@spaceorder/db/constants";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { cookieOptions } from "../../../../utils/cookieOptions";

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
  cookieStore.set(name, value, { ...cookieOptions, ...options });
}

export async function clearServerCookie(names: CookieKey[]) {
  const cookieStore = await cookies();
  for (const name of names) {
    cookieStore.delete({ name, ...cookieOptions });
  }
}
