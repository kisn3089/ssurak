"use client";

import { useTableOrderRealtimeDaemon } from "@/lib/realtime/useTableOrderRealtimeDaemon";
import { pathToQueryKey } from "@spaceorder/api/utils/pathToQueryKey";
import { OrderRealtimeEvent } from "@spaceorder/db/types";
import { toastByLevel } from "@spaceorder/ui/components/sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function TableOrderRealtimeDaemon({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const handleRealtimeEvent = ({ notice }: OrderRealtimeEvent) => {
    void queryClient.invalidateQueries({
      queryKey: pathToQueryKey("orders/v1/sessions/orders"),
    });

    const { level, message } = notice || {};
    if (level && message?.customer) {
      toastByLevel(level, message.customer);
    }
  };

  useTableOrderRealtimeDaemon({
    onCreatedAction: handleRealtimeEvent,
    onUpdatedAction: handleRealtimeEvent,
    onCancelledAction: handleRealtimeEvent,
  });

  return children;
}
