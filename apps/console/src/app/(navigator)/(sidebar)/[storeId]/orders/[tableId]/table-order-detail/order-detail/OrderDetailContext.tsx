"use client";

import { createContext, useContext } from "react";
import { OrderItemWithOrder } from "./OrderDetailTable";
import { PublicOrderWithItem } from "@spaceorder/db/types";
import useOrderItem from "@spaceorder/api/core/order/order-item/useOrderItem.mutate";

/**
 * TableOrderDetail Compound Component의 Context 인터페이스
 * - state: 테이블 세션, 주문 아이템, 총 금액, 편집 상태, 요청 상태
 * - actions: 주문 아이템 수정/삭제, 선택 초기화
 * - meta: storeId, tableId, 로딩 상태
 */

// State
export interface OrderDetailState {
  orders: PublicOrderWithItem[];
  orderItems: OrderItemWithOrder[];
  totalPrice: number;
  editingItem: OrderItemWithOrder | null;
  updateMutation: ReturnType<typeof useOrderItem>["update"];
  removeMutation: ReturnType<typeof useOrderItem>["remove"];
}

// Actions
export interface OrderDetailActions {
  setEditingItem: (item: OrderItemWithOrder | null) => void;
  updateEditingQuantity: (delta: number) => void;
  resetSelection: () => void;
  updateOrderItem: () => Promise<void>;
  removeOrderItem: () => Promise<void>;
}

// Meta
export interface OrderDetailMeta {
  storeId: string;
  tableId: string;
  isRefetching: boolean;
}

// Context Value
export interface OrderDetailContextValue {
  state: OrderDetailState;
  actions: OrderDetailActions;
  meta: OrderDetailMeta;
}

export const OrderDetailContext = createContext<OrderDetailContextValue | null>(
  null
);

export function useOrderDetailContext() {
  const context = useContext(OrderDetailContext);
  if (!context) {
    throw new Error(
      "useOrderDetailContext must be used within a OrderDetailProvider"
    );
  }
  return context;
}
