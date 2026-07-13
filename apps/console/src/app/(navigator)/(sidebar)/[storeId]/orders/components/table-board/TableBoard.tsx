"use client";

import TableList from "../table-order-list/TableList";
import { OrderBoardByStoreResponse } from "@ssurak/api/types/board/board.interface";
import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import TableBoardLayout from "./TableOrderListLayout";
import { useParams } from "next/navigation";
import { GlobalTimerProvider } from "@ssurak/ui/components/session-timer/GlobalTimerContext";

export default function TableBoard() {
  const params = useParams<{ storeId: string }>();

  const { data: tables } = useSuspenseWithAuth<OrderBoardByStoreResponse>(
    `/orders/v1/stores/${params.storeId}/board`
  );

  return (
    <GlobalTimerProvider>
      <TableBoardLayout>
        {tables.map((sanitizedTable) => (
          <TableList
            key={sanitizedTable.publicId}
            sanitizedTable={sanitizedTable}
          />
        ))}
      </TableBoardLayout>
    </GlobalTimerProvider>
  );
}
