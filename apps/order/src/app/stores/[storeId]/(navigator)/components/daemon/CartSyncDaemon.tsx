"use client";

import { useCartSyncDaemon } from "@/lib/realtime/useCartSyncDaemon";
import { CartSyncEvent } from "@ssurak/api/types/realtime/syncNotice.interface";
import { makeQueryKey } from "@ssurak/api/utils/makeQueryKey";
import { toastByLevel } from "@ssurak/ui/components/sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function CartSyncDaemon() {
  const queryClient = useQueryClient();

  const synchronize = ({ notice }: CartSyncEvent) => {
    void queryClient.invalidateQueries({
      queryKey: makeQueryKey("/carts/v1/sessions/carts"),
    });

    const { level, message } = notice || {};
    if (level && message?.customer) {
      toastByLevel(level, message.customer);
    }
  };

  useCartSyncDaemon({
    onCreated: synchronize,
    onUpdated: synchronize,
    onDeleted: synchronize,
    onCleared: synchronize,
  });

  return null;
}
