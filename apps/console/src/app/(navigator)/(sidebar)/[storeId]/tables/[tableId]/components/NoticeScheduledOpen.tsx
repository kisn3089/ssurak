"use client";

import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import { Table } from "@ssurak/api/types/table/table.interface";
import { useParams } from "next/navigation";

export default function NoticeScheduledOpen() {
  const { storeId, tableId } = useParams<{
    storeId: string;
    tableId: string;
  }>();
  const { data: table } = useSuspenseWithAuth<Table>(
    `/stores/v1/${storeId}/tables/${tableId}`
  );

  return (
    <div className="p-12">
      <h1 className="font-bold text-2xl">테이블 {table.tableNumber}</h1>
      <div className="grid place-content-center min-h-96 font-semibold text-lg text-center">
        <span>현재 서비스 준비 중입니다.</span>
        <span>추후 테이블의 상세한 주문 데이터들을 확인할 수 있습니다.</span>
      </div>
    </div>
  );
}
