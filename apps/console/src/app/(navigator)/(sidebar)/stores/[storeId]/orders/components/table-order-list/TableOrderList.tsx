"use client";

import { BoardTableWithSessions } from "@spaceorder/db";
import { TableOrderCard } from "./table-order-card";

type TableBoardProps = {
  sanitizedTable: BoardTableWithSessions;
};

export default function TableOrderList({ sanitizedTable }: TableBoardProps) {
  const session = sanitizedTable.tableSessions?.[0] ?? null;

  return (
    <TableOrderCard.Card sanitizedTable={sanitizedTable}>
      <TableOrderCard.Header sanitizedTable={sanitizedTable} />
      <TableOrderCard.Content>
        <TableOrderCard.OrderList tableId={sanitizedTable.publicId} />
      </TableOrderCard.Content>
      <TableOrderCard.Footer expiresAt={session?.expiresAt} />
    </TableOrderCard.Card>
  );
}
