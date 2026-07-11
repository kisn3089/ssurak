import type { PublicStore } from "@spaceorder/db";
import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import PersistLastStore from "./components/PersistLastStore";

/**
 * 매장 스코프 레이아웃.
 * `/stores/v1/{storeId}` 조회로 매장 소유·유효성을 검증하고(백엔드 StoreAccessGuard),
 * 실패 시 상위 error boundary로 전달한다. 유효한 매장은 마지막 접속 매장 쿠키에 기록한다.
 */
export default async function StoreScopeLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}>) {
  const { storeId } = await params;

  return (
    <ServerPrefetch<PublicStore> url={`/stores/v1/${storeId}`} shouldSuccess>
      <PersistLastStore storeId={storeId} />
      {children}
    </ServerPrefetch>
  );
}
