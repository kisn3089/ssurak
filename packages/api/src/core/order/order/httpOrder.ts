import {
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../../../schemas/model/order.schema";
import { OrderWithItemsResponse } from "../../../types/order/order.interface";
import { http } from "../../axios/http";

const prefix = "/orders/v1";

async function createOrderByTable(
  tableId: string,
  createOrderPayload: CreateOrderPayload
): Promise<OrderWithItemsResponse> {
  const response = await http.post<OrderWithItemsResponse>(
    `${prefix}/tables/${tableId}/orders`,
    createOrderPayload
  );
  return response.data;
}

async function updateOrderByTable(
  orderId: string,
  updateOrderPayload: UpdateOrderPayload
) {
  const response = await http.patch<OrderWithItemsResponse>(
    `${prefix}/${orderId}`,
    updateOrderPayload
  );
  return response.data;
}

/**
 * 고객 주문 생성 요청.
 * orderItems는 보내지 않는다 — 서버가 인증된 세션의 redis cart(SSOT)를 읽고
 * cart 버전으로 멱등성을 보장한다.
 */
export type CreateOrderRequest = {
  memo?: string;
};

async function createOrderByCustomer(
  createOrderPayload: CreateOrderRequest
): Promise<OrderWithItemsResponse> {
  const response = await http.post<OrderWithItemsResponse>(
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
