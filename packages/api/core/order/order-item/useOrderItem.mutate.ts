import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { httpOrderItems, UpdateOrderItemPayload } from "./httpOrderItem";
import {
  PublicOrderItem,
  PublicOrderWithItem,
} from "@spaceorder/db/types/publicModel.type";
import { pathToQueryKey } from "../../../utils/pathToQueryKey";

type UseOrderItemReturn = {
  update: UseMutationResult<
    PublicOrderItem,
    Error,
    {
      orderItemId: string;
      updateOrderItemPayload: UpdateOrderItemPayload;
    }
  >;
  remove: UseMutationResult<void, Error, { orderItemId: string }>;
};

type Params = { storeId: string; tableId: string };

function tableOrdersQueryKey(tableId: string) {
  return pathToQueryKey(`/orders/v1/tables/${tableId}/active-session/orders`);
}

function someOrderItem(
  orderItems: PublicOrderItem[],
  orderItemId: string
): boolean {
  return orderItems.some((oi) => oi.publicId === orderItemId);
}

export default function useOrderItem({ tableId }: Params): UseOrderItemReturn {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationKey: ["order-item", "update"],
    mutationFn: ({
      orderItemId,
      updateOrderItemPayload,
    }: {
      orderItemId: string;
      updateOrderItemPayload: UpdateOrderItemPayload;
    }) => httpOrderItems.updateOrderItem(orderItemId, updateOrderItemPayload),
    onMutate: async ({ orderItemId, updateOrderItemPayload }) => {
      await queryClient.cancelQueries({
        queryKey: tableOrdersQueryKey(tableId),
      });

      const previousOrders = queryClient.getQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId)
      );

      queryClient.setQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId),
        (orders) =>
          orders?.map((order) => {
            if (someOrderItem(order.orderItems, orderItemId)) {
              return {
                ...order,
                orderItems: order.orderItems.map((oi) =>
                  oi.publicId === orderItemId
                    ? { ...oi, ...updateOrderItemPayload }
                    : oi
                ),
              };
            }
            return order;
          })
      );

      return { previousOrders };
    },
    onError: (_e, _v, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          tableOrdersQueryKey(tableId),
          context.previousOrders
        );
      }
    },
    onSuccess: (updatedOrderitem: PublicOrderItem) => {
      queryClient.setQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId),
        (orders) =>
          orders?.map((order) => {
            if (someOrderItem(order.orderItems, updatedOrderitem.publicId)) {
              return {
                ...order,
                orderItems: order.orderItems.map((oi) =>
                  oi.publicId === updatedOrderitem.publicId
                    ? updatedOrderitem
                    : oi
                ),
              };
            }
            return order;
          })
      );
    },
  });

  const remove = useMutation({
    mutationKey: ["order-item", "remove"],
    mutationFn: ({ orderItemId }: { orderItemId: string }) =>
      httpOrderItems.removeOrderItem(orderItemId),
    onMutate: async ({ orderItemId }) => {
      await queryClient.cancelQueries({
        queryKey: tableOrdersQueryKey(tableId),
      });

      const previousOrders = queryClient.getQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId)
      );

      queryClient.setQueryData<PublicOrderWithItem[]>(
        tableOrdersQueryKey(tableId),
        (orders) =>
          orders?.map((order) => {
            if (someOrderItem(order.orderItems, orderItemId)) {
              return {
                ...order,
                orderItems: order.orderItems.filter(
                  (oi) => oi.publicId !== orderItemId
                ),
              };
            }
            return order;
          })
      );

      return { previousOrders };
    },
    onError: (_e, _v, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          tableOrdersQueryKey(tableId),
          context.previousOrders
        );
      }
    },
  });

  return { update, remove };
}
