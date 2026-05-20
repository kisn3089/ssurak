import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Cart, TableSession } from "@spaceorder/db";
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

@ApiTags("Customer Cart")
@Controller("sessions/carts")
@UseGuards(SessionAuth)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @DocsCustomerCartGet()
  async getCartList(@Session() session: TableSession): Promise<Cart> {
    return this.cartService.getCartList(session.sessionToken);
  }

  @Post()
  @UseGuards(ZodValidation({ body: addCartItemPayloadSchema }))
  @DocsCustomerCartAddItem()
  async addItem(
    @Session() session: TableSession,
    @Body() addCartItemPayload: CreateCartItemPayloadDto
  ): Promise<Cart> {
    return this.cartService.addItem(session, addCartItemPayload);
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
    @Session() session: TableSession,
    @Param("cartItemId") cartItemId: string,
    @Body() updateCartItemPayload: UpdateCartItemPayloadDto
  ): Promise<Cart> {
    return this.cartService.updateItem(
      session,
      cartItemId,
      updateCartItemPayload
    );
  }

  @Delete(":cartItemId")
  @UseGuards(ZodValidation({ params: cartItemIdSchema }))
  @DocsCustomerCartRemoveItem()
  async removeItem(
    @Session() session: TableSession,
    @Param("cartItemId") cartItemId: string
  ): Promise<Cart> {
    return this.cartService.removeItem(session, cartItemId);
  }

  @Delete()
  @DocsCustomerCartClear()
  async clearCart(@Session() session: TableSession): Promise<void> {
    return this.cartService.clearCart(session);
  }
}
