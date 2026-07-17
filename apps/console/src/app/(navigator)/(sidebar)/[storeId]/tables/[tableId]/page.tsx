import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import { Metadata } from "next";
import { use } from "react";
import NoticeScheduledOpen from "./components/NoticeScheduledOpen";

export const metadata: Metadata = {
  title: "테이블 상세 정보 - ssurak",
  description: "테이블의 관련된 정보를 확인할 수 있는 페이지입니다.",
};

export default function TableDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; tableId: string }>;
}) {
  const { storeId, tableId } = use(params);

  return (
    <ServerPrefetch url={`/stores/v1/${storeId}/tables/${tableId}`}>
      <NoticeScheduledOpen />
    </ServerPrefetch>
  );
}
