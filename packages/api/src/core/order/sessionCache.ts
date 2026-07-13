import { ActiveSessionResponse } from "../../types/board/board.interface";
import { OrderWithItemsResponse } from "../../types/order/order.interface";
import { OrderItem } from "../../types/orderItem/orderItem.interface";

/**
 * 활성 세션 캐시(ActiveSessionResponse)의 주문들을 매핑한다.
 * 세션이 없으면(null/undefined) 그대로 반환해 setQueryData updater에 그대로 쓸 수 있다.
 */
export function mapSessionOrders(
  session: ActiveSessionResponse | undefined,
  mapOrder: (order: OrderWithItemsResponse) => OrderWithItemsResponse
): ActiveSessionResponse | undefined {
  return session && { ...session, orders: session.orders.map(mapOrder) };
}

/**
 * 활성 세션 캐시에서 해당 항목(orderItemId)이 속한 주문의 orderItems만 변환한다.
 * 그 외 주문은 건드리지 않는다.
 */
export function mapSessionOrderItems(
  session: ActiveSessionResponse | undefined,
  orderItemId: string,
  mapItems: (orderItems: OrderItem[]) => OrderItem[]
): ActiveSessionResponse | undefined {
  return mapSessionOrders(session, (order) =>
    order.orderItems.some((oi) => oi.publicId === orderItemId)
      ? { ...order, orderItems: mapItems(order.orderItems) }
      : order
  );
}
