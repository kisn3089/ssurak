import { OrderItem } from "../../../types/orderItem/orderItem.interface";
import { http } from "../../axios/http";
import { UpdateOrderItemPayload } from "../../../schemas/model/orderItem.schema";

const prefix = "/orders/v1";

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
