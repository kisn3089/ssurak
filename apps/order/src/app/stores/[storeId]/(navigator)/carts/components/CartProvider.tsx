"use client";

import { createContext, useContext, useState } from "react";
import useSuspenseWithSession from "@spaceorder/api/hooks/useSuspenseWithSession";
import { CreateOrderRequest, useCartMutations } from "@spaceorder/api/core";
import type { Cart, PublicCartItem } from "@spaceorder/db/types/cart.type";
import useOrderByCustomer from "@spaceorder/api/core/order/order/useOrderByCustomer.mutate";
import { PublicOrderWithItem } from "@spaceorder/db/types/publicModel.type";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "@spaceorder/ui/components/sonner";
import { useParams, useRouter } from "next/navigation";

type CartState = {
  menus: PublicCartItem[];
  quantities: Record<string, number>;
  createOrderMutate: UseMutationResult<
    PublicOrderWithItem,
    Error,
    CreateOrderRequest,
    unknown
  >;
};

type CartActions = {
  changeQuantity: (menuPublicId: string, newQuantity: number) => void;
  removeMenu: (menuId: string) => Promise<Cart>;
  createOrderRequest: () => Promise<void>;
};

type CartMeta = {
  totalPrice: number;
};

type CartContextValue = {
  state: CartState;
  actions: CartActions;
  meta: CartMeta;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();
  const { data: menus } = useSuspenseWithSession<Cart, PublicCartItem[]>(
    "/carts/v1/sessions/carts",
    { queryOptions: { select: (carts) => carts.menus } }
  );

  // TODO: 수량 변경할 때마다 바로 redis cart에 반영하도록 변경

  const cartMutate = useCartMutations();
  const createOrderMutate = useOrderByCustomer().createOrderByCustomer;

  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(menus.map((menu) => [menu.menuPublicId, menu.quantity]))
  );

  const changeQuantity = (menuPublicId: string, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [menuPublicId]: newQuantity }));
  };

  const createOrderRequest = async () => {
    const payload: CreateOrderRequest = {
      orderItems: menus.map((menu) => ({
        menuPublicId: menu.menuPublicId,
        quantity: quantities[menu.menuPublicId] || menu.quantity,
        menuName: menu.menuName,
        ...(menu.requiredOptions
          ? { requiredOptions: menu.requiredOptions }
          : undefined),
        ...(menu.customOptions
          ? { customOptions: menu.customOptions }
          : undefined),
      })),
    };

    try {
      await createOrderMutate.mutateAsync(payload);
      toast.success("주문이 완료되었습니다.");
      router.push(`/stores/${storeId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("주문 생성에 실패했습니다.");
      throw error;
    }
  };

  const totalPrice = menus.reduce((acc, menu) => {
    const quantity = quantities[menu.menuPublicId] || menu.quantity;
    return acc + menu.unitPrice * quantity;
  }, 0);

  const removeMenu = (menuId: string) => {
    return cartMutate.remove.mutateAsync(menuId);
  };

  return (
    <CartContext.Provider
      value={{
        state: {
          menus,
          quantities,
          createOrderMutate,
        },
        actions: {
          changeQuantity,
          removeMenu,
          createOrderRequest,
        },
        meta: { totalPrice },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
