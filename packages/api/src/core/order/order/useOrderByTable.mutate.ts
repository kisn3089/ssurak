import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpOrder } from "./httpOrder";
import { makeQueryKey } from "../../../utils/makeQueryKey";
import { ActiveSessionResponse } from "../../../types/board/board.interface";
import { mapSessionOrders } from "../sessionCache";
import {
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../../../schemas/model/order.schema";

function tableOrdersQueryKey(tableId: string) {
  return makeQueryKey(`/orders/v1/tables/${tableId}/active-session`);
}

type CreateOrderByTable = {
  tableId: string;
  createOrderPayload: CreateOrderPayload;
};
export type UpdateOrderByTable = {
  orderId: string;
  updateOrderPayload: UpdateOrderPayload;
};

type Params = { tableId: string };

export default function useOrderByTable({ tableId }: Params) {
  const queryClient = useQueryClient();

  const createOrderByTable = useMutation({
    mutationKey: ["owner", "order", "create"],
    mutationFn: ({ tableId, createOrderPayload }: CreateOrderByTable) =>
      httpOrder.createOrderByTable(tableId, createOrderPayload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: tableOrdersQueryKey(tableId) }),
  });

  const updateOrderByTable = useMutation({
    mutationKey: ["owner", "order", "update"],
    mutationFn: ({ orderId, updateOrderPayload }: UpdateOrderByTable) =>
      httpOrder.updateOrderByTable(orderId, updateOrderPayload),
    onMutate: async ({ orderId, updateOrderPayload }) => {
      await queryClient.cancelQueries({
        queryKey: tableOrdersQueryKey(tableId),
      });

      const previousOrders = queryClient.getQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId)
      );

      const nextStatus = updateOrderPayload.status;
      if (nextStatus) {
        queryClient.setQueryData<ActiveSessionResponse>(
          tableOrdersQueryKey(tableId),
          (session) =>
            mapSessionOrders(session, (order) =>
              order.publicId === orderId
                ? { ...order, status: nextStatus }
                : order
            )
        );
      }

      return { previousOrders };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          tableOrdersQueryKey(tableId),
          context.previousOrders
        );
      }
    },
    onSuccess: (serverOrder) => {
      queryClient.setQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId),
        (session) =>
          mapSessionOrders(session, (order) =>
            order.publicId === serverOrder.publicId ? serverOrder : order
          )
      );
    },
  });

  return { createOrderByTable, updateOrderByTable };
}
