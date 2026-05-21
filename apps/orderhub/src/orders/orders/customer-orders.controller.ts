import type { Response } from "express";
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SessionAuth } from "src/utils/guards/table-session-auth.guard";
import {
  COOKIE_TABLE,
  type PublicOrderWithItem,
  type TableSession,
} from "@spaceorder/db";
import {
  createOrderPayloadSchema,
  orderIdParamsSchema,
} from "@spaceorder/api/schemas";
import { ZodValidation } from "src/utils/guards/zod-validation.guard";
import { Session } from "src/decorators/session.decorator";
import {
  DocsCustomerOrderCreate,
  DocsCustomerOrderDelete,
  DocsCustomerOrderGetList,
  DocsCustomerOrderGetUnique,
} from "src/docs/order.docs";
import { CreateOrderPayloadDto } from "src/dto/order.dto";
import { OrdersService } from "./orders.service";
import { ORDER_ITEMS_WITH_OMIT_PRIVATE } from "src/common/query/order-item-query.const";
import { responseCookie } from "src/utils/cookies";

@ApiTags("Customer Order")
@Controller("sessions/orders")
@UseGuards(SessionAuth)
export class CustomerOrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @UseGuards(ZodValidation({ body: createOrderPayloadSchema }))
  @DocsCustomerOrderCreate()
  async create(
    @Session() tableSession: TableSession,
    @Body() createOrderPayload: CreateOrderPayloadDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<
    PublicOrderWithItem<"Wide", { sessionToken: string; expiresAt: Date }>
  > {
    const createdOrder = await this.orderService.createOrder(
      { id: tableSession.id },
      createOrderPayload
    );

    responseCookie.set(
      response,
      COOKIE_TABLE.SESSION_TOKEN,
      createdOrder.tableSession.sessionToken,
      {
        expires: createdOrder.tableSession.expiresAt,
      }
    );

    return createdOrder;
  }

  @Get()
  @DocsCustomerOrderGetList()
  async list(
    @Session() tableSession: TableSession
  ): Promise<PublicOrderWithItem<"Wide">[]> {
    return await this.orderService.getOrderList({
      where: { tableSessionId: tableSession.id },
      ...ORDER_ITEMS_WITH_OMIT_PRIVATE,
    });
  }

  @Get(":orderId")
  @UseGuards(ZodValidation({ params: orderIdParamsSchema }))
  @DocsCustomerOrderGetUnique()
  async unique(
    @Session() tableSession: TableSession,
    @Param("orderId") orderId: string
  ): Promise<PublicOrderWithItem<"Wide">> {
    return await this.orderService.getOrderUnique({
      where: { publicId: orderId, tableSessionId: tableSession.id },
      ...ORDER_ITEMS_WITH_OMIT_PRIVATE,
    });
  }

  @Delete(":orderId")
  @UseGuards(ZodValidation({ params: orderIdParamsSchema }))
  @DocsCustomerOrderDelete()
  async delete(
    @Session() tableSession: TableSession,
    @Param("orderId") orderId: string
  ): Promise<PublicOrderWithItem<"Wide">> {
    return await this.orderService.cancelOrder({ tableSession, orderId });
  }
}
