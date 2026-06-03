import { aliveSessionFilter } from "./session-query.const";

export const orderSituationPayload = () => ({
  tableSessions: {
    ...aliveSessionFilter(),
    select: {
      publicId: true,
      expiresAt: true,
      orders: {
        select: {
          publicId: true,
          status: true,
          orderItems: {
            select: { publicId: true, menuName: true, quantity: true },
          },
        },
      },
    },
  },
});
