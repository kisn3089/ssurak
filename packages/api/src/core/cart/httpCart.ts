import {
  AddCartItemPayload,
  UpdateCartItemPayload,
} from "../../schemas/model/cart.schema";
import {
  Cart,
  CartWithNoticeResponse,
  CartWithOptionalNoticeResponse,
} from "../../types/cart/cart.interface";
import { http } from "../axios/http";

const prefix = "/carts/v1";

async function getCart(): Promise<Cart> {
  const res = await http.get<Cart>(`${prefix}/sessions/carts`);
  return res.data;
}

async function addCartItem(
  payload: AddCartItemPayload
): Promise<CartWithNoticeResponse> {
  const res = await http.post<CartWithNoticeResponse>(
    `${prefix}/sessions/carts`,
    payload
  );
  return res.data;
}

async function updateCartItem(
  cartItemId: string,
  payload: UpdateCartItemPayload
): Promise<CartWithOptionalNoticeResponse> {
  const res = await http.patch<CartWithOptionalNoticeResponse>(
    `${prefix}/sessions/carts/${cartItemId}`,
    payload
  );
  return res.data;
}

async function removeCartItem(
  cartItemId: string
): Promise<CartWithNoticeResponse> {
  const res = await http.delete<CartWithNoticeResponse>(
    `${prefix}/sessions/carts/${cartItemId}`
  );
  return res.data;
}

async function clearCart(): Promise<void> {
  await http.delete(`${prefix}/sessions/carts`);
}

/**
 * Owner용 - Authorization 헤더는 axios 인터셉터에서 자동 설정
 */
async function getCartByOwner(
  storeId: string,
  sessionToken: string
): Promise<Cart> {
  const res = await http.get<Cart>(
    `${prefix}/stores/${storeId}/sessions/${sessionToken}/carts`
  );
  return res.data;
}

export const httpCart = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartByOwner,
};
