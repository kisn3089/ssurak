"use server";

import { getAccessToken } from "@/app/common/servers/getAccessToken";
import { http } from "@ssurak/api/core/axios/http";
import type { Store } from "@ssurak/api/types/store/store.interface";

export async function getStores(): Promise<Store[]> {
  const accessToken = await getAccessToken();

  return http
    .get<Store[]>("/stores/v1", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => res.data);
}
