import { Injectable, Logger } from "@nestjs/common";
import { OrderSyncEvent, SyncNotice } from "@spaceorder/db";
import { REALTIME_EVENT, realtimeRoom } from "./realtime.constants";
import { RealtimeGateway } from "./realtime.gateway";

export type OrderSubscriber = {
  storePublicId: string;
  tablePublicId: string;
};

@Injectable()
export class OrderEventsService {
  private readonly logger = new Logger(OrderEventsService.name);

  constructor(private readonly gateway: RealtimeGateway) {}

  emitOrderCreated(subscriber: OrderSubscriber, notice: SyncNotice): void {
    this.broadcast(REALTIME_EVENT.ORDER_CREATED, subscriber, { notice });
  }

  emitOrderUpdated(subscriber: OrderSubscriber, notice: SyncNotice): void {
    this.broadcast(REALTIME_EVENT.ORDER_UPDATED, subscriber, { notice });
  }

  emitOrderCancelled(subscriber: OrderSubscriber, notice: SyncNotice): void {
    this.broadcast(REALTIME_EVENT.ORDER_CANCELLED, subscriber, { notice });
  }

  /** OrderItem Events */
  emitOrderItemUpdated(subscriber: OrderSubscriber, notice: SyncNotice): void {
    this.broadcast(REALTIME_EVENT.ORDER_ITEM_UPDATED, subscriber, { notice });
  }

  emitOrderItemRemoved(subscriber: OrderSubscriber, notice: SyncNotice): void {
    this.broadcast(REALTIME_EVENT.ORDER_ITEM_DELETED, subscriber, { notice });
  }

  private broadcast(
    event: string,
    { storePublicId, tablePublicId }: OrderSubscriber,
    payload: OrderSyncEvent
  ): void {
    const { server } = this.gateway;
    const adminsRoom = realtimeRoom.admins(storePublicId);
    const tableRoom = realtimeRoom.table(storePublicId, tablePublicId);
    server.to([adminsRoom, tableRoom]).emit(event, payload);
    this.logger.log(`emit ${event} → ${adminsRoom}, ${tableRoom}`);
  }
}
