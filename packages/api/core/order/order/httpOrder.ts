import {
  OrderStatus,
  PublicOrderItem,
  PublicOrderWithItem,
} from "@spaceorder/db";
import { http } from "../../axios";

const prefix = "/orders/v1";

type ItemOption = Record<string, string>;
type OrderItemOption = {
  requiredOptions?: ItemOption;
  customOptions?: ItemOption;
};
export type CreateOrderByTablePayload = {
  orderItems: Array<
    { menuPublicId: string } & Pick<PublicOrderItem, "quantity"> &
      Partial<Pick<PublicOrderItem, "menuName"> & OrderItemOption>
  >;
  memo?: string;
};

async function createOrderByTable(
  tableId: string,
  createOrderPayload: CreateOrderByTablePayload
): Promise<PublicOrderWithItem> {
  const response = await http.post<PublicOrderWithItem>(
    `${prefix}/tables/${tableId}/orders`,
    createOrderPayload
  );
  return response.data;
}

export type UpdateOrderByTablePayload = Partial<
  CreateOrderByTablePayload & {
    status: OrderStatus;
    cancelledReason: string;
  }
>;

async function updateOrderByTable(
  orderId: string,
  updateOrderPayload: UpdateOrderByTablePayload
) {
  const response = await http.patch<PublicOrderWithItem>(
    `${prefix}/${orderId}`,
    updateOrderPayload
  );
  return response.data;
}

/**
 * customer 주문 API
 */

export type CreateOrderItem = {
  menuPublicId: string;
  quantity: number;
  menuName: string;
  requiredOptions?: Record<string, string>;
  customOptions?: Record<string, string>;
};

export type CreateOrderRequest = {
  orderItems: CreateOrderItem[];
  memo?: string;
};

async function createOrderByCustomer(
  createOrderPayload: CreateOrderRequest
): Promise<PublicOrderWithItem> {
  const response = await http.post<PublicOrderWithItem>(
    `${prefix}/sessions/orders`,
    createOrderPayload
  );
  return response.data;
}

export const httpOrder = {
  createOrderByTable,
  updateOrderByTable,
  createOrderByCustomer,
};
