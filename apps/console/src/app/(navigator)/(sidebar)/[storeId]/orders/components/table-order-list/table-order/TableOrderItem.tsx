"use client";

import { OrderWithItemsResponse } from "@ssurak/api/types/order/order.interface";
import { nextStatusMap } from "@ssurak/api/utils/OrderStateMap.const";
import useOrderByTable from "@ssurak/api/core/order/order/useOrderByTable.mutate";
import { TableOrder } from ".";

interface TableOrderItemProps {
  order: OrderWithItemsResponse;
  tableId: string;
}

export function TableOrderItem({ order, tableId }: TableOrderItemProps) {
  const { updateOrderByTable: updateOrderByTableMutation } = useOrderByTable({
    tableId,
  });

  const onOrderStatusUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextStatus = nextStatusMap[order.status];
    if (!nextStatus) {
      return;
    }

    updateOrderByTableMutation.mutate({
      orderId: order.publicId,
      updateOrderPayload: { status: nextStatus },
    });
  };

  return (
    <TableOrder.ItemLayout>
      <TableOrder.ItemError
        isError={updateOrderByTableMutation.isError}
        isLoading={updateOrderByTableMutation.isPending}
        disabled={updateOrderByTableMutation.isPending}
        onRetry={onOrderStatusUpdate}
      />
      <TableOrder.StatusBadge
        orderStatus={order.status}
        isLoading={updateOrderByTableMutation.isPending}
        updateNextStatus={onOrderStatusUpdate}
      />
      {order.orderItems.map((orderItem) => (
        <TableOrder.MenuInfo
          key={orderItem.publicId}
          menuName={orderItem.menuName}
          quantity={orderItem.quantity}
        />
      ))}
    </TableOrder.ItemLayout>
  );
}
