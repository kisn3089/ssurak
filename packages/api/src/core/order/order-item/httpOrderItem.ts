import { OrderItem } from "../../../types/orderItem/orderItem.interface";
import { http } from "../../axios/http";
import z from "zod";
import { createOrderItemPayloadSchema } from "../../../schemas/model/orderItem.schema";

const prefix = "/orders/v1";

type CreateOrderItemPayload = z.infer<typeof createOrderItemPayloadSchema>;
export type UpdateOrderItemPayload = Partial<CreateOrderItemPayload>;

async function updateOrderItem(
  orderItemId: string,
  updateOrderItemPayload: UpdateOrderItemPayload
): Promise<OrderItem> {
  const response = await http.patch<OrderItem>(
    `${prefix}/order-items/${orderItemId}`,
    updateOrderItemPayload
  );
  return response.data;
}

async function removeOrderItem(orderItemId: string): Promise<void> {
  const response = await http.delete<void>(
    `${prefix}/order-items/${orderItemId}`
  );
  return response.data;
}

export const httpOrderItems = {
  updateOrderItem,
  removeOrderItem,
};
