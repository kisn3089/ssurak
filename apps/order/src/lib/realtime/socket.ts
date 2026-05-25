import { io, Socket } from "socket.io-client";

const REALTIME_URL = `${process.env.NEXT_PUBLIC_ORDERHUB_URL ?? "http://localhost:8080"}/events`;
const REALTIME_PATH = "/ws/";

let socket: Socket | null = null;

export const getRealtimeSocket = (): Socket => {
  if (socket) return socket;
  socket = io(REALTIME_URL, {
    path: REALTIME_PATH,
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
  });
  return socket;
};

export const REALTIME_EVENT = {
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",
  ORDER_CANCELLED: "order.cancelled",
} as const;
