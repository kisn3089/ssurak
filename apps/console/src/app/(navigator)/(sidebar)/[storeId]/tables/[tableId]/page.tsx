import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import { Metadata } from "next";
import { use } from "react";
import NoticeScheduledOpen from "./components/NoticeScheduledOpen";

export const metadata: Metadata = {
  title: "테이블 상세 정보 - ssurak",
  description: "테이블의 관련된 정보를 확인할 수 있는 페이지입니다.",
};

export type TableDetailPageProps = {
  params: Promise<{ storeId: string; tableId: string }>;
};

export default function TableDetailPage({ params }: TableDetailPageProps) {
  const { storeId, tableId } = use(params);

  return (
    <ServerPrefetch url={`/stores/v1/${storeId}/tables/${tableId}`}>
      <NoticeScheduledOpen content="추후 테이블의 상세한 주문 데이터들을 확인할 수 있습니다." title="테이블 상세 정보" />
    </ServerPrefetch>
  );
}
