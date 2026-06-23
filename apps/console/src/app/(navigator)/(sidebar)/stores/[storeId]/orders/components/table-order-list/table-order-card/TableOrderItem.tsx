"use client";

import { CardContent } from "@spaceorder/ui/components/card";
import { Badge } from "@spaceorder/ui/components/badge";
import { BADGE_BY_ORDER_STATUS } from "@spaceorder/ui/constants/badgeByOrderStatus.const";
import {
  nextStatusMap,
  OrderStatus,
  PublicOrderWithItem,
} from "@spaceorder/db";
import ButtonWrapper from "@spaceorder/ui/components/ButtonWrapper";
import { Button } from "@spaceorder/ui/components/button";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import useOrderByTable from "@spaceorder/api/core/order/order/useOrderByTable.mutate";

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
    <ButtonWrapper disabled={isFinishStatus} onClick={onOrderStatusUpdate}>
      <CardContent
        className={`rounded-lg bg-accent ${!isFinishStatus ? "hover:bg-background" : ""} border p-2 font-semibold flex flex-col justify-center`}
      >
        <ActivityRender value={updateOrderByTableMutation.isError}>
          {() => (
            <Button
              className="w-full mb-2"
              variant={"destructive"}
              onClick={onOrderStatusUpdate}
            >
              다시 시도
            </Button>
          )}
        </ActivityRender>
        <div className="flex justify-center">
          <Badge
            variant={BADGE_BY_ORDER_STATUS[order.status].badgeVariant}
            className="w-fit text-xs"
            isLoading={updateOrderByTableMutation.isPending}
          >
            {BADGE_BY_ORDER_STATUS[order.status].label}
          </Badge>
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
    </ButtonWrapper>
  );
}
