"use client";

import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import { TableOrderItem } from "./TableOrderItem";
import { PublicOrderWithItem } from "@spaceorder/db/types";

type TableOrderOrderListProps = {
  orders: PublicOrderWithItem[];
  tableId: string;
};

export function TableOrderOrderList({
  orders,
  tableId,
}: TableOrderOrderListProps) {
  return (
    <div className="flex flex-col gap-y-1 p-2">
      <ActivityRender mode={orders && orders.length > 0 ? "visible" : "hidden"}>
        {orders
          ?.filter((order) => order.orderItems.length > 0)
          .map((order) => (
            <TableOrderItem
              key={order.publicId}
              order={order}
              tableId={tableId}
            />
          ))}
      </ActivityRender>
    </div>
  );
}
