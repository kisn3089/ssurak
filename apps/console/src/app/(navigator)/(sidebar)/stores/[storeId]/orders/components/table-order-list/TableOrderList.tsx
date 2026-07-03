"use client";

import { ActiveSessionResponse, BoardTableWithSession } from "@spaceorder/db";
import { TableOrderCard } from "./table-order-card";
import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";

type TableBoardProps = {
  sanitizedTable: BoardTableWithSession;
};

export default function TableOrderList({ sanitizedTable }: TableBoardProps) {
  const { data: session } = useSuspenseWithAuth<ActiveSessionResponse>(
    `/orders/v1/tables/${sanitizedTable.publicId}/active-session`
  );
  const orders = session?.orders ?? [];

  return (
    <TableOrderCard.Card sanitizedTable={sanitizedTable}>
      <TableOrderCard.Header sanitizedTable={sanitizedTable} />
      <TableOrderCard.Content>
        <TableOrderCard.AcceptAllButton
          orders={orders}
          tableId={sanitizedTable.publicId}
        />
        <TableOrderCard.OrderList
          orders={orders}
          tableId={sanitizedTable.publicId}
        />
      </TableOrderCard.Content>
      <TableOrderCard.Footer expiresAt={session?.expiresAt} />
    </TableOrderCard.Card>
  );
}
