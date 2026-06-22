import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { httpOrderItems, UpdateOrderItemPayload } from "./httpOrderItem";
import { PublicOrderItem } from "@spaceorder/db/types/publicModel.type";
import { pathToQueryKey } from "../../../utils/pathToQueryKey";
import { ActiveSessionResponse } from "@spaceorder/db/types/board.type";
import { mapSessionOrderItems } from "../sessionCache";

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
  return pathToQueryKey(`/orders/v1/tables/${tableId}/active-session`);
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

      const previousOrders = queryClient.getQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId)
      );

      queryClient.setQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId),
        (session) =>
          mapSessionOrderItems(session, orderItemId, (orderItems) =>
            orderItems.map((oi) =>
              oi.publicId === orderItemId
                ? { ...oi, ...updateOrderItemPayload }
                : oi
            )
          )
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
      queryClient.setQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId),
        (session) =>
          mapSessionOrderItems(
            session,
            updatedOrderitem.publicId,
            (orderItems) =>
              orderItems.map((oi) =>
                oi.publicId === updatedOrderitem.publicId
                  ? updatedOrderitem
                  : oi
              )
          )
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

      const previousOrders = queryClient.getQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId)
      );

      queryClient.setQueryData<ActiveSessionResponse>(
        tableOrdersQueryKey(tableId),
        (session) =>
          mapSessionOrderItems(session, orderItemId, (orderItems) =>
            orderItems.filter((oi) => oi.publicId !== orderItemId)
          )
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
