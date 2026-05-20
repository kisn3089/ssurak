import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { OrderItemController } from "./order-item/orderItem.controller";
import { OrderItemService } from "./order-item/orderItem.service";
import { OrdersController } from "./orders/orders.controller";
import { OrdersService } from "./orders/orders.service";
import { CustomerOrdersController } from "./orders/customer-orders.controller";

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [
    OrderItemController,
    OrdersController,
    CustomerOrdersController,
  ],
  providers: [OrderItemService, OrdersService],
})
export class OrderModule {}
