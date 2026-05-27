import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Cart, SessionWithTable } from "@spaceorder/db";
import {
  addCartItemPayloadSchema,
  cartItemIdSchema,
  updateCartItemPayloadSchema,
} from "@spaceorder/api/schemas";
import { ZodValidation } from "src/utils/guards/zod-validation.guard";
import { SessionAuth } from "src/utils/guards/table-session-auth.guard";
import { Session } from "src/decorators/session.decorator";
import { CartService } from "./carts.service";
import {
  CreateCartItemPayloadDto,
  UpdateCartItemPayloadDto,
} from "src/dto/cart.dto";
import {
  DocsCustomerCartGet,
  DocsCustomerCartAddItem,
  DocsCustomerCartUpdateItem,
  DocsCustomerCartRemoveItem,
  DocsCustomerCartClear,
} from "src/docs/cart.docs";
import { CartEventsService } from "src/realtime/cart-events.service";

@ApiTags("Customer Cart")
@Controller("sessions/carts")
@UseGuards(SessionAuth)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartEvents: CartEventsService
  ) {}

  @Get()
  @DocsCustomerCartGet()
  async getCartList(@Session() session: SessionWithTable): Promise<Cart> {
    return this.cartService.getCartList(session.sessionToken);
  }

  @Post()
  @UseGuards(ZodValidation({ body: addCartItemPayloadSchema }))
  @DocsCustomerCartAddItem()
  async addItem(
    @Session() session: SessionWithTable,
    @Body() addCartItemPayload: CreateCartItemPayloadDto
  ): Promise<Cart> {
    const { cart, broadcast } = await this.cartService.addItem(
      session,
      addCartItemPayload
    );
    this.cartEvents.emitCartAdd(broadcast.subscriber, broadcast.payload);
    return cart;
  }

  @Patch(":cartItemId")
  @UseGuards(
    ZodValidation({
      params: cartItemIdSchema,
      body: updateCartItemPayloadSchema,
    })
  )
  @DocsCustomerCartUpdateItem()
  async updateItem(
    @Session() session: SessionWithTable,
    @Param("cartItemId") cartItemId: string,
    @Body() updateCartItemPayload: UpdateCartItemPayloadDto,
    @Headers("x-socket-id") socketId?: string
  ): Promise<Cart> {
    const { cart, broadcast } = await this.cartService.updateItem(
      session,
      cartItemId,
      updateCartItemPayload
    );
    this.cartEvents.emitCartUpdated(
      broadcast.subscriber,
      broadcast.payload,
      socketId
    );
    return cart;
  }

  @Delete(":cartItemId")
  @UseGuards(ZodValidation({ params: cartItemIdSchema }))
  @DocsCustomerCartRemoveItem()
  async removeItem(
    @Session() session: SessionWithTable,
    @Param("cartItemId") cartItemId: string
  ): Promise<Cart> {
    const { cart, broadcast } = await this.cartService.removeItem(
      session,
      cartItemId
    );
    this.cartEvents.emitCartDeleted(broadcast.subscriber, broadcast.payload);
    return cart;
  }

  @Delete()
  @DocsCustomerCartClear()
  async clearCart(@Session() session: SessionWithTable): Promise<void> {
    const { broadcast } = await this.cartService.clearCart(session);
    this.cartEvents.emitCartCleared(broadcast.subscriber, broadcast.payload);
  }
}
