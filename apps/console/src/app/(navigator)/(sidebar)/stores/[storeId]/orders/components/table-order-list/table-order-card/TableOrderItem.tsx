"use client";

import { CardContent } from "@spaceorder/ui/components/layouts/card";
import { BADGE_BY_ORDER_STATUS } from "@spaceorder/ui/constants/badgeByOrderStatus.const";
import {
  nextStatusMap,
  OrderStatus,
  PublicOrderWithItem,
} from "@spaceorder/db";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import useOrderByTable from "@spaceorder/api/core/order/order/useOrderByTable.mutate";
import { Badge } from "@spaceorder/ui/components/forms/badge";
import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";

interface TableOrderItemProps {
  order: PublicOrderWithItem;
  tableId: string;
}

export function TableOrderItem({ order, tableId }: TableOrderItemProps) {
  const { updateOrderByTable: updateOrderByTableMutation } = useOrderByTable({
    tableId,
  });

  const isFinishStatus =
    order.status === OrderStatus.COMPLETED ||
    order.status === OrderStatus.CANCELLED;

  const onOrderStatusUpdate = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const nextStatus = nextStatusMap[order.status];
    if (!nextStatus) {
      return;
    }

    await updateOrderByTableMutation.mutateAsync({
      orderId: order.publicId,
      updateOrderPayload: { status: nextStatus },
    });
  };

  return (
    <CardContent
      className={`rounded-lg bg-background border p-2 font-semibold flex flex-col justify-center`}
    >
      <ActivityRender value={updateOrderByTableMutation.isError}>
        {() => (
          <TouchEventButton
            className="w-full mb-2"
            variant={"destructive"}
            onClick={onOrderStatusUpdate}
            disabled={updateOrderByTableMutation.isPending}
          >
            다시 시도
          </TouchEventButton>
        )}
      </ActivityRender>
      <div className="flex justify-center cursor-pointer">
        <button
          className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          onClick={onOrderStatusUpdate}
          disabled={isFinishStatus || updateOrderByTableMutation.isPending}
        >
          <Badge
            variant={BADGE_BY_ORDER_STATUS[order.status].badgeVariant}
            className="w-fit text-xs cursor-pointer"
            isLoading={updateOrderByTableMutation.isPending}
          >
            {BADGE_BY_ORDER_STATUS[order.status].label}
          </Badge>
        </button>
      </div>
      {order.orderItems.map((orderItem) => (
        <div
          className="flex justify-between text-sm/5"
          key={orderItem.publicId}
        >
          <p>{orderItem.menuName}</p>
          <p className="tabular-nums">{orderItem.quantity}</p>
        </div>
      ))}
    </CardContent>
  );
}
