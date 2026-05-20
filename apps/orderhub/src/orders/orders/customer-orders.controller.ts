import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SessionAuth } from "src/utils/guards/table-session-auth.guard";
import type { PublicOrderWithItem, TableSession } from "@spaceorder/db";
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
    @Body() createOrderPayload: CreateOrderPayloadDto
  ): Promise<PublicOrderWithItem<"Wide">> {
    return await this.orderService.createOrder(
      { id: tableSession.id },
      createOrderPayload
    );
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
