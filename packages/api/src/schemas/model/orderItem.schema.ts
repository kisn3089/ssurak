import z from "zod";
import { commonSchema } from "../common";

export const optionItemSchema = z.record(z.string(), z.string());

export type CreateOrderItemPayload = z.infer<
  typeof createOrderItemPayloadSchema
>;
export const createOrderItemPayloadSchema = z
  .object({
    menuPublicId: commonSchema.cuid2("Menu"),
    quantity: z.number().min(1, "수량은 최소 1 이상이어야 합니다."),
    requiredOptions: optionItemSchema.optional(),
    customOptions: optionItemSchema.optional(),
  })
  .strict();

export type UpdateOrderItemPayload = z.infer<
  typeof updateOrderItemPayloadSchema
>;
export const updateOrderItemPayloadSchema = createOrderItemPayloadSchema
  .partial()
  .strict();
