import z from "zod";
import { OrderStatus } from "../../types/order/order.interface";
import { createOrderItemPayloadSchema } from "./orderItem.schema";

export type CreateOrderPayload = z.infer<typeof createOrderPayloadSchema>;
/** Body Schema */
export const createOrderPayloadSchema = z.object({
  orderItems: createOrderItemPayloadSchema.array(),
  memo: z.string().max(50, "메모는 최대 50자까지 가능합니다.").optional(),
});

export type UpdateOrderPayload = z.infer<typeof updateOrderPayloadSchema>;
export const updateOrderPayloadSchema = createOrderPayloadSchema
  .omit({ orderItems: true })
  .extend({
    status: z.nativeEnum(OrderStatus),
    cancelledReason: z
      .string()
      .max(50, "취소 사유는 최대 50자까지 가능합니다."),
  })
  .partial()
  .strict();
