import { redirect } from "next/navigation";
import { COOKIE_TABLE } from "@spaceorder/db/constants";
import { getStores } from "@/app/common/servers/getStores";
import { getServerCookie } from "@/app/common/servers/cookies";

type StoreEntryRedirectProps = {
  /**
   * 선택된 매장으로 이동할 경로를 만든다.
   * 기본은 주문 현황(`/{storeId}/orders`)이며, 다른 진입점에서 재사용할 수 있다.
   */
  to?: (storeId: string) => string;
};

export default async function StoreEntryRedirect({
  to = (storeId) => `/${storeId}/orders`,
}: StoreEntryRedirectProps) {
  const stores = await getStores();

  if (stores.length === 0) {
    throw new Error("등록된 매장이 없습니다. 매장을 먼저 등록해주세요.");
  }

  const lastStoreId = (
    await getServerCookie(COOKIE_TABLE.LAST_ACCESSED_STORE_ID)
  )?.value;

  const target =
    stores.find((store) => store.publicId === lastStoreId) ?? stores[0];

  redirect(to(target.publicId));

  return null;
}
