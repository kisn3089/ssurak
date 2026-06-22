"use client";

import { useStoreOrderSyncDaemon } from "@/lib/realtime/useStoreOrderSyncDaemon";
import { pathToQueryKey } from "@spaceorder/api/utils/pathToQueryKey";
import { OrderSyncEvent } from "@spaceorder/db/types";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function OrderSyncDaemon() {
  const params = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();

  const synchronize = (event: OrderSyncEvent) => {
    queryClient.invalidateQueries({
      queryKey: pathToQueryKey(
        `/orders/v1/tables/${event.tablePublicId}/active-session`
      ),
    });
  };

  useStoreOrderSyncDaemon(params.storeId, {
    onCreatedAction: synchronize,
    onUpdatedAction: synchronize,
    onCancelledAction: synchronize,
  });

  return null;
}
