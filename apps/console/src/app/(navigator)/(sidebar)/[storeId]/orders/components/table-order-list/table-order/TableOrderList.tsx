"use client";

import { TableOrderItem } from "./TableOrderItem";
import { OrderWithItemsResponse } from "@ssurak/api/types/order/order.interface";

type TableOrderListProps = {
  orders: OrderWithItemsResponse[];
  tableId: string;
};

export function TableOrderList({ orders, tableId }: TableOrderListProps) {
  if (orders.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-1 p-2">
      {orders
        .filter((order) => order.orderItems.length > 0)
        .map((order) => (
          <TableOrderItem
            key={order.publicId}
            order={order}
            tableId={tableId}
          />
        ))}
    </div>
  );
}
