"use client";

import TableOrderList from "../table-order-list/TableOrderList";
import { OrderBoardByStore } from "@spaceorder/db";
import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";
import TableBoardLayout from "../table-order-list/TableOrderListLayout";
import { GlobalTimerProvider } from "@/app/common/orders/GlobalTimerContext";
import { useParams } from "next/navigation";

export default function TableBoard() {
  const params = useParams<{ storeId: string }>();

  const { data: tables } = useSuspenseWithAuth<OrderBoardByStore>(
    `/orders/v1/stores/${params.storeId}/board`
  );

  return (
    <GlobalTimerProvider>
      <TableBoardLayout>
        {tables.map((sanitizedTable) => (
          <TableOrderList
            key={sanitizedTable.publicId}
            sanitizedTable={sanitizedTable}
          />
        ))}
      </TableBoardLayout>
    </GlobalTimerProvider>
  );
}
