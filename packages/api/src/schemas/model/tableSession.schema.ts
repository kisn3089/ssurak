import z from "zod";
import { TableSessionStatus } from "../../types/tableSession/tableSession.interface";

export const updateReactivateSchema = z
  .object({ status: z.literal("REACTIVATE") })
  .strict();

export const updateDeactivateSchema = z
  .object({ status: z.literal(TableSessionStatus.CLOSED) })
  .strict();

export const updateActivateSchema = z
  .object({
    status: z.literal(TableSessionStatus.ACTIVE),
    paidAmount: z
      .number()
      .min(0, "결제할 금액은 0원 이상이어야 합니다.")
      .optional(),
  })
  .strict();

export const updateCustomerActivateSchema = z
  .object({ status: z.literal(TableSessionStatus.ACTIVE) })
  .strict();

export const updateExtendsExpireAtSchema = z
  .object({ status: z.literal("EXTEND_EXPIRES_AT") })
  .strict();

export const updateSessionPaymentSchema = z
  .object({ status: z.literal(TableSessionStatus.PAYMENT_PENDING) })
  .strict();

export const updateSessionPayloadSchema = z.discriminatedUnion("status", [
  updateReactivateSchema,
  updateDeactivateSchema,
  updateActivateSchema,
  updateExtendsExpireAtSchema,
  updateSessionPaymentSchema,
]);

export const updateCustomerSessionPayloadSchema = z.discriminatedUnion(
  "status",
  [
    updateCustomerActivateSchema,
    updateExtendsExpireAtSchema,
    updateSessionPaymentSchema,
  ]
);
