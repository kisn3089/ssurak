import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrderByTablePayload,
  httpOrder,
  UpdateOrderByTablePayload,
} from "./httpOrder";
import { pathToQueryKey } from "../../../utils/pathToQueryKey";
import { PublicOrderWithItem } from "@spaceorder/db";

function tableOrdersQueryKey(tableId: string) {
  return pathToQueryKey(`/orders/v1/tables/${tableId}/active-session/orders`);
}

type CreateOrderByTable = {
  tableId: string;
  createOrderPayload: CreateOrderByTablePayload;
};
export type UpdateOrderByTable = {
  orderId: string;
  updateOrderPayload: UpdateOrderByTablePayload;
};

type Params = { tableId: string };

export default function useOrderByTable({ tableId }: Params) {
  const queryClient = useQueryClient();

  const createOrderByTable = useMutation({
    mutationKey: ["owner", "order", "create"],
    mutationFn: ({ tableId, createOrderPayload }: CreateOrderByTable) =>
      httpOrder.createOrderByTable(tableId, createOrderPayload),
    onSuccess: (serverOrder) => {
      queryClient.setQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId),
        (orders) => (orders ? [...orders, serverOrder] : orders)
      );
    },
  });

  const updateOrderByTable = useMutation({
    mutationKey: ["owner", "order", "update"],
    mutationFn: ({ orderId, updateOrderPayload }: UpdateOrderByTable) =>
      httpOrder.updateOrderByTable(orderId, updateOrderPayload),
    onMutate: async ({ orderId, updateOrderPayload }) => {
      await queryClient.cancelQueries({
        queryKey: tableOrdersQueryKey(tableId),
      });

      const previousOrders = queryClient.getQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId)
      );

      const nextStatus = updateOrderPayload.status;
      if (nextStatus) {
        queryClient.setQueryData<PublicOrderWithItem[]>(
          tableOrdersQueryKey(tableId),
          (orders) =>
            orders?.map((order) =>
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
      queryClient.setQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId),
        (orders) =>
          orders?.map((order) =>
            order.publicId === serverOrder.publicId ? serverOrder : order
          )
      );
    },
  });

  return { createOrderByTable, updateOrderByTable };
}
