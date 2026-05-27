import { Injectable, Logger } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { REALTIME_EVENT, realtimeRoom } from "./realtime.constants";
import { CartSyncEvent } from "@spaceorder/db";

type Subscriber = {
  storePublicId: string;
  tablePublicId: string;
};

@Injectable()
export class CartEventsService {
  private readonly logger = new Logger(CartEventsService.name);

  constructor(private readonly gateway: RealtimeGateway) {}

  emitCartAdd(subscriber: Subscriber, cart: CartSyncEvent): void {
    this.broadcast(REALTIME_EVENT.CART_CREATED, subscriber, cart);
  }

  emitCartUpdated(
    subscriber: Subscriber,
    cart: CartSyncEvent,
    excludeSocketId?: string
  ): void {
    this.broadcast(
      REALTIME_EVENT.CART_UPDATED,
      subscriber,
      cart,
      excludeSocketId
    );
  }

  emitCartDeleted(subscriber: Subscriber, cart: CartSyncEvent): void {
    this.broadcast(REALTIME_EVENT.CART_DELETED, subscriber, cart);
  }

  emitCartCleared(subscriber: Subscriber, cart: CartSyncEvent): void {
    this.broadcast(REALTIME_EVENT.CART_CLEARED, subscriber, cart);
  }

  private broadcast(
    event: string,
    { storePublicId, tablePublicId }: Subscriber,
    payload: CartSyncEvent,
    excludeSocketId?: string
  ): void {
    const { server } = this.gateway;
    const tableRoom = realtimeRoom.table(storePublicId, tablePublicId);
    const scope = excludeSocketId
      ? server.to(tableRoom).except(excludeSocketId)
      : server.to(tableRoom);
    scope.emit(event, payload);
    this.logger.log(
      `emit ${event} → ${tableRoom}${excludeSocketId ? ` (except ${excludeSocketId})` : ""}`
    );
  }
}
