"use client";

import { useEffect } from "react";
import {
  getRealtimeSocket,
  REALTIME_EVENT,
  subscribeAdmin,
  unsubscribeAdmin,
} from "./socket";
import { OrderSyncEvent } from "@spaceorder/db/types";
import { useQueryClient } from "@tanstack/react-query";
import { pathToQueryKey } from "@spaceorder/api/utils";

export type StoreRealtimeHandlers = {
  onCreatedAction?: (event: OrderSyncEvent) => void;
  onUpdatedAction?: (event: OrderSyncEvent) => void;
  onCancelledAction?: (event: OrderSyncEvent) => void;
};

export const useStoreOrderSyncDaemon = (
  storeId: string | undefined,
  handlers: StoreRealtimeHandlers
): void => {
  const { onCreatedAction, onUpdatedAction, onCancelledAction } = handlers;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!storeId) return;

    const socket = getRealtimeSocket();

    const invalidateOrders = () => {
      void queryClient.invalidateQueries({
        queryKey: pathToQueryKey(`/orders/v1/stores/${storeId}/board`),
      });
      void queryClient.invalidateQueries({
        queryKey: pathToQueryKey("/orders/v1/tables"),
      });
    };

    socket.io.on("reconnect", invalidateOrders);

    return () => {
      socket.io.off("reconnect", invalidateOrders);
    };
  }, [storeId, queryClient]);

  useEffect(() => {
    if (!storeId) return;

    const socket = getRealtimeSocket();
    subscribeAdmin(storeId);

    if (onCreatedAction) {
      socket.on(REALTIME_EVENT.ORDER_CREATED, onCreatedAction);
    }

    if (onUpdatedAction) {
      socket.on(REALTIME_EVENT.ORDER_UPDATED, onUpdatedAction);
      socket.on(REALTIME_EVENT.ORDER_ITEM_UPDATED, onUpdatedAction);
    }

    if (onCancelledAction) {
      socket.on(REALTIME_EVENT.ORDER_CANCELLED, onCancelledAction);
      socket.on(REALTIME_EVENT.ORDER_ITEM_DELETED, onCancelledAction);
    }

    return () => {
      if (onCreatedAction) {
        socket.off(REALTIME_EVENT.ORDER_CREATED, onCreatedAction);
      }

      if (onUpdatedAction) {
        socket.off(REALTIME_EVENT.ORDER_UPDATED, onUpdatedAction);
        socket.off(REALTIME_EVENT.ORDER_ITEM_UPDATED, onUpdatedAction);
      }

      if (onCancelledAction) {
        socket.off(REALTIME_EVENT.ORDER_CANCELLED, onCancelledAction);
        socket.off(REALTIME_EVENT.ORDER_ITEM_DELETED, onCancelledAction);
      }

      unsubscribeAdmin(storeId);
    };
  }, [storeId, onCreatedAction, onUpdatedAction, onCancelledAction]);
};
