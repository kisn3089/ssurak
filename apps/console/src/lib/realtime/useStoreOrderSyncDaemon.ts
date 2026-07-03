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

  /**
   * 소켓 재연결 시 끊긴 동안 놓친 이벤트를 보정한다.
   * connectionStateRecovery가 없어 유실된 이벤트는 재전송되지 않고, 전역 QueryClient는
   * refetchOnMount/refetchOnWindowFocus가 꺼져 있어 소켓만 끊긴 경우(서버 배포/LB/Redis)
   * 자동 refetch가 걸리지 않는다. 초기 connect가 아닌 재연결(reconnect)에서만 실행된다.
   */
  useEffect(() => {
    if (!storeId) return;

    const socket = getRealtimeSocket();

    const invalidateOrders = () => {
      void queryClient.invalidateQueries({
        queryKey: pathToQueryKey(`/orders/v1/stores/${storeId}/board`),
      });
      void queryClient.invalidateQueries({ queryKey: ["orders/v1", "tables"] });
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
