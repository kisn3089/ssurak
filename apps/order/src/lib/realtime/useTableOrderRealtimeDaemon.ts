"use client";

import { useEffect } from "react";
import { getRealtimeSocket, REALTIME_EVENT } from "./socket";
import { OrderRealtimeEvent } from "@spaceorder/db/types";

export type TableRealtimeHandlers = {
  onCreatedAction?: (event: OrderRealtimeEvent) => void;
  onUpdatedAction?: (event: OrderRealtimeEvent) => void;
  onCancelledAction?: (event: OrderRealtimeEvent) => void;
};

export const useTableOrderRealtimeDaemon = (
  handlers: TableRealtimeHandlers
): void => {
  const { onCreatedAction, onUpdatedAction, onCancelledAction } = handlers;

  useEffect(() => {
    const socket = getRealtimeSocket();
    if (!socket.connected) socket.connect();

    if (onCreatedAction)
      socket.on(REALTIME_EVENT.ORDER_CREATED, onCreatedAction);
    if (onUpdatedAction)
      socket.on(REALTIME_EVENT.ORDER_UPDATED, onUpdatedAction);
    if (onCancelledAction)
      socket.on(REALTIME_EVENT.ORDER_CANCELLED, onCancelledAction);

    return () => {
      if (onCreatedAction)
        socket.off(REALTIME_EVENT.ORDER_CREATED, onCreatedAction);
      if (onUpdatedAction)
        socket.off(REALTIME_EVENT.ORDER_UPDATED, onUpdatedAction);
      if (onCancelledAction)
        socket.off(REALTIME_EVENT.ORDER_CANCELLED, onCancelledAction);
    };
  }, [onCreatedAction, onUpdatedAction, onCancelledAction]);
};
