"use client";

import { useState } from "react";
import { sumFromObjects } from "@spaceorder/api";
import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";
import {
  OrderDetailContext,
  type OrderDetailContextValue,
} from "./OrderDetailContext";
import { OrderItemWithOrder } from "./OrderDetailTable";
import { ActiveSessionResponse } from "@spaceorder/db/types";
import useOrderItem from "@spaceorder/api/core/order/order-item/useOrderItem.mutate";
import { toast } from "@spaceorder/ui/components/sonner";

interface OrderDetailProviderProps {
  params: { storeId: string; tableId: string };
  children: React.ReactNode;
}

export function OrderDetailProvider({
  params,
  children,
}: OrderDetailProviderProps) {
  const { storeId, tableId } = params;
  const fetchUrl = `/orders/v1/tables/${tableId}/active-session`;

  const { data: session, isRefetching } =
    useSuspenseWithAuth<ActiveSessionResponse>(fetchUrl, {
      queryOptions: { refetchOnMount: true },
    });

  const { update, remove } = useOrderItem({ storeId, tableId });

  const [editingItem, setEditingItem] = useState<OrderItemWithOrder | null>(
    null
  );

  const orders = session?.orders ?? [];

  const orderItems: OrderItemWithOrder[] = orders.flatMap((order) =>
    order.orderItems.map((item) => ({
      ...item,
      totalPrice: item.unitPrice * item.quantity,
      orderId: order.publicId,
      orderStatus: order.status,
    }))
  );

  const totalPrice = sumFromObjects(orderItems, (item) => item.totalPrice);

  // Actions
  const updateEditingQuantity = (delta: number) => {
    setEditingItem((prev) =>
      prev
        ? {
            ...prev,
            totalPrice: prev.unitPrice * Math.max(1, prev.quantity + delta),
            quantity: Math.max(1, prev.quantity + delta),
          }
        : null
    );
  };

  const resetSelection = () => {
    setEditingItem(null);
  };

  const updateOrderItem = async () => {
    if (!editingItem) return;

    try {
      await update.mutateAsync({
        orderItemId: editingItem.publicId,
        updateOrderItemPayload: { quantity: editingItem.quantity },
      });
      toast.success(
        `${editingItem.menuName} 수량을 ${editingItem.quantity}개로 변경했습니다.`,
        { position: "top-center" }
      );
      resetSelection();
    } catch {
      toast.error(`${editingItem.menuName} 수량을 변경하는데 실패했습니다.`, {
        position: "top-center",
      });
    }
  };

  const removeOrderItem = async () => {
    if (!editingItem) return;

    try {
      await remove.mutateAsync({ orderItemId: editingItem.publicId });
      toast.success(`${editingItem.menuName} 메뉴를 주문에서 제외했습니다.`, {
        position: "top-center",
      });
      resetSelection();
    } catch {
      toast.error(
        `${editingItem.menuName} 메뉴를 주문에서 제외하는데 실패했습니다.`,
        { position: "top-center" }
      );
    }
  };

  const contextValue: OrderDetailContextValue = {
    state: {
      orders,
      orderItems,
      totalPrice,
      editingItem,
      updateMutation: update,
      removeMutation: remove,
    },
    actions: {
      setEditingItem,
      updateEditingQuantity,
      resetSelection,
      updateOrderItem,
      removeOrderItem,
    },
    meta: {
      storeId,
      tableId,
      isRefetching,
    },
  };

  return (
    <OrderDetailContext.Provider value={contextValue}>
      {children}
    </OrderDetailContext.Provider>
  );
}
