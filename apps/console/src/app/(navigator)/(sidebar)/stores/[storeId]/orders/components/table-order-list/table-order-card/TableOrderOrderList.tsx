"use client";

import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import { TableOrderItem } from "./TableOrderItem";
import { PublicOrderWithItem } from "@spaceorder/db/types";
import { TableOrderCard } from ".";
import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";

type TableOrderOrderListProps = {
  tableId: string;
};

export function TableOrderOrderList({ tableId }: TableOrderOrderListProps) {
  const { data: orders } = useSuspenseWithAuth<PublicOrderWithItem[]>(
    `/orders/v1/tables/${tableId}/active-session/orders`
  );

  return (
    <div className="flex flex-col gap-y-1 p-2">
      <TableOrderCard.AcceptAllButton orders={orders} tableId={tableId} />
      <ActivityRender mode={orders && orders.length > 0 ? "visible" : "hidden"}>
        {orders
          ?.filter((order) => order.orderItems.length > 0)
          .map((order) => (
            <TableOrderItem key={order.publicId} order={order} />
          ))}
      </ActivityRender>
    </div>
  );
}
