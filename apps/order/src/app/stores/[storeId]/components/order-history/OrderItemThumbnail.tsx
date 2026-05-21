"use client";

import useSuspenseWithSession from "@spaceorder/api/hooks/useSuspenseWithSession";
import { PublicOrderWithItem } from "@spaceorder/db/types";
import MenuImage from "../../(navigator)/menus/components/MenuImage";

export default function OrderItemThumbnail() {
  const { data: orders } = useSuspenseWithSession<
    PublicOrderWithItem<"Wide">[]
  >("/orders/v1/sessions/orders");

  if (orders.length === 0) {
    return (
      <div className="rounded-md bg-cyan-400 w-24 h-24 flex items-center justify-center">
        <span className="text-white text-sm">주문 내역이 없습니다.</span>
      </div>
    );
  }

  const order = orders[0].orderItems[0];

  return (
    <div className="rounded-md bg-cyan-400 w-24 h-24 overflow-hidden">
      <MenuImage size="item" src={order.menuImageUrl} alt={order.menuName} />
    </div>
  );
}
