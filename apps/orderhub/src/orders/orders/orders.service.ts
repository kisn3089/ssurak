import { Injectable } from "@nestjs/common";
import {
  OrderCreateNoticeMessage,
  OrderRealtimeEvent,
  OrderStatus,
  Owner,
  Prisma,
  PublicOrderWithItem,
  SessionWithTable,
  SummarizedOrdersByStore,
  TableSession,
  TableSessionStatus,
} from "@spaceorder/db";
import { SessionClient } from "src/internal/clients/session.client";
import { PrismaService } from "src/prisma/prisma.service";
import { orderSituationPayload } from "src/common/query/order-query.const";
import { ORDER_ITEMS_WITH_OMIT_PRIVATE } from "src/common/query/order-item-query.const";
import {
  CreateOrderPayloadDto,
  UpdateOrderPayloadDto,
} from "src/dto/order.dto";
import { createOrderItemsWithValidMenu } from "src/common/validate/order/create-order-item";
import { ALIVE_SESSION_STATUSES } from "src/common/query/session-query.const";
import { validateOrderSessionToWrite } from "src/common/validate/order/order-session-to-write";
import { MENU_VALIDATION_FIELDS_SELECT } from "src/common/query/menu-query.const";
import { TABLE_OMIT } from "src/common/query/table-query.const";
import { SessionIdentifier } from "src/internal/services/session-core.service";
import { OrderEventsService } from "src/realtime/order-events.service";

type CreateOrderParams = SessionIdentifier;
type CancelParams =
  | { orderId: string; ownerId: bigint }
  | { tableSession: TableSession; orderId: string };
type UpdateEventKind = "updated" | "cancelled";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionClient: SessionClient,
    private readonly orderEvents: OrderEventsService
  ) {}

  async createOrder(
    params: CreateOrderParams,
    createOrderPayload: CreateOrderPayloadDto
  ): Promise<
    PublicOrderWithItem<"Wide", { sessionToken: string; expiresAt: Date }>
  > {
    const { order, session } = await this.prismaService.$transaction(
      async (tx) => {
        const session: SessionWithTable =
          await this.sessionClient.txGetOrCreateSession(tx, params);

        const menuPublicIds = createOrderPayload.orderItems.map(
          (item) => item.menuPublicId
        );

        const menus = await tx.menu.findMany({
          where: {
            publicId: { in: menuPublicIds },
            deletedAt: null,
            category: { storeId: session.table.storeId },
          },
          select: MENU_VALIDATION_FIELDS_SELECT,
        });

        const orderItemsData = createOrderItemsWithValidMenu(
          createOrderPayload,
          menus,
          menuPublicIds
        );

        if (session.status !== TableSessionStatus.ACTIVE) {
          await this.sessionClient.updateSessionStatus(
            tx,
            session,
            TableSessionStatus.ACTIVE
          );
        }

        const order = await tx.order.create({
          data: {
            storeId: session.table.storeId,
            tableId: session.table.id,
            tableSessionId: session.id,
            orderItems: { create: orderItemsData },
            memo: createOrderPayload.memo,
          },
          include: {
            ...ORDER_ITEMS_WITH_OMIT_PRIVATE.include,
            tableSession: { select: { sessionToken: true, expiresAt: true } },
          },
          omit: ORDER_ITEMS_WITH_OMIT_PRIVATE.omit,
        });

        return { order, session };
      }
    );

    const noticeMessage: OrderCreateNoticeMessage = {
      owner: `${session.table.tableNumber}번 테이블에서 새 주문이 들어왔습니다.`,
      ...("publicId" in params && {
        customer: `매장에서 주문을 생성하였습니다.`,
      }),
    };

    const notice: OrderRealtimeEvent["notice"] = {
      level: "info",
      message: noticeMessage,
    };

    this.orderEvents.emitOrderCreated(
      {
        storePublicId: session.table.store.publicId,
        tablePublicId: session.table.publicId,
      },
      notice
    );

    return order;
  }

  async getOrdersSummary(
    client: Owner,
    storeId: string
  ): Promise<SummarizedOrdersByStore> {
    return await this.prismaService.table.findMany({
      where: { store: { ownerId: client.id, publicId: storeId } },
      include: orderSituationPayload(),
      omit: TABLE_OMIT,
    });
  }

  async getOrdersByAliveSession(
    tableId: string
  ): Promise<PublicOrderWithItem<"Wide">[]> {
    return await this.prismaService.order.findMany({
      where: {
        table: { publicId: tableId },
        tableSession: {
          expiresAt: { gt: new Date() },
          status: { in: ALIVE_SESSION_STATUSES },
        },
      },
      ...ORDER_ITEMS_WITH_OMIT_PRIVATE,
    });
  }

  async getOrderList<T extends Prisma.OrderFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindManyArgs>
  ): Promise<Prisma.OrderGetPayload<T>[]> {
    return await this.prismaService.order.findMany(args);
  }

  async getOrderUnique<T extends Prisma.OrderFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindFirstOrThrowArgs>
  ): Promise<Prisma.OrderGetPayload<T>> {
    return await this.prismaService.order.findFirstOrThrow(args);
  }

  async partialUpdateOrder(
    orderId: string,
    ownerId: bigint,
    updatePayload: UpdateOrderPayloadDto
  ): Promise<PublicOrderWithItem<"Wide">> {
    return this.updateOrderWithValidation(
      { orderId, ownerId },
      updatePayload,
      "updated"
    );
  }

  async cancelOrder(
    params: CancelParams
  ): Promise<PublicOrderWithItem<"Wide">> {
    return this.updateOrderWithValidation(
      params,
      { status: OrderStatus.CANCELLED },
      "cancelled"
    );
  }

  private async updateOrderWithValidation(
    params: CancelParams,
    data: Prisma.OrderUpdateInput,
    eventKind: UpdateEventKind
  ): Promise<PublicOrderWithItem<"Wide">> {
    const whereClause: Prisma.OrderWhereInput =
      "tableSession" in params
        ? { publicId: params.orderId, tableSessionId: params.tableSession.id }
        : {
            publicId: params.orderId,
            store: { ownerId: params.ownerId },
          };

    const order = await this.prismaService.order.findFirst({
      where: whereClause,
      include: {
        tableSession: true,
        store: { select: { publicId: true } },
        table: { select: { publicId: true, tableNumber: true } },
      },
    });

    const validOrder = validateOrderSessionToWrite(order);

    const updated = await this.prismaService.order.update({
      where: { id: validOrder.id },
      data,
      ...ORDER_ITEMS_WITH_OMIT_PRIVATE,
    });

    const target = {
      storePublicId: validOrder.store.publicId,
      tablePublicId: validOrder.table.publicId,
    };

    if (eventKind === "cancelled") {
      // 현재는 주문 업데이트는 관리자만 가능하므로, 주문 취소 이벤트는 무조건 관리자가 트리거한 것으로 간주
      // const triggeredByCustomer = "tableSession" in params;
      const cancelNotice: OrderRealtimeEvent["notice"] = {
        level: "error",
        message: ORDER_STATUS_MESSAGE_MAP[OrderStatus.CANCELLED],
      };
      this.orderEvents.emitOrderCancelled(target, cancelNotice);
    } else {
      const updateNotice: OrderRealtimeEvent["notice"] = {
        level: "info",
        message: ORDER_STATUS_MESSAGE_MAP[updated.status],
      };
      this.orderEvents.emitOrderUpdated(target, updateNotice);
    }

    return updated;
  }
}

const ORDER_STATUS_MESSAGE_MAP: Record<OrderStatus, OrderCreateNoticeMessage> =
  {
    [OrderStatus.PENDING]: {
      owner: "주문 수락 대기 중입니다.",
    },
    [OrderStatus.ACCEPTED]: {
      customer: "주문이 수락되었습니다.",
    },
    [OrderStatus.PREPARING]: {
      customer: "음식이 준비 중입니다.",
    },
    [OrderStatus.COMPLETED]: {
      customer: "음식이 제공되었습니다. 맛있게 드세요 🥂",
    },
    [OrderStatus.CANCELLED]: {
      owner: "관리자가 주문을 취소하였습니다.",
      customer: "주문이 취소되었습니다.",
    },
  };
