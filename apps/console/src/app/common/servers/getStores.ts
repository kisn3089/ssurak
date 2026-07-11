"use server";

import { getAccessToken } from "@/app/common/servers/getAccessToken";
import { http } from "@spaceorder/api";
import type { PublicStore } from "@spaceorder/db";

export async function getStores(): Promise<PublicStore[]> {
  const accessToken = await getAccessToken();

  return http
    .get<PublicStore[]>("/stores/v1", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => res.data);
}
