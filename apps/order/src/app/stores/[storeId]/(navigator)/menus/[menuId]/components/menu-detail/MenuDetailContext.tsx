"use client";

import { createContext, useContext } from "react";
import type { MenuOptionEntry, PublicMenu } from "@spaceorder/db/types";
import { useCartMutations } from "@spaceorder/api/core/cart/useCart.mutate";

export type SelectedOptions = {
  required: Map<string, string>;
  custom: Map<string, string>;
};

export interface MenuDetailState {
  menu: PublicMenu;
  quantity: number;
  selectedOptions: SelectedOptions;
}

export interface MenuDetailActions {
  setQuantity: (next: number) => void;
  selectRequiredOption: (groupKey: string, optionKey: string) => void;
  selectCustomOption: (groupKey: string, optionKey: string) => void;
  addCart: () => void;
}

export interface MenuDetailMeta {
  requiredOptions: MenuOptionEntry[];
  customOptions: MenuOptionEntry[];
  allSelectedOptions: Map<string, string>;
  price: number;
  addCartMutate: ReturnType<typeof useCartMutations>["add"];
}

export interface MenuDetailContextValue {
  state: MenuDetailState;
  actions: MenuDetailActions;
  meta: MenuDetailMeta;
}

export const MenuDetailContext = createContext<MenuDetailContextValue | null>(
  null
);

export function useMenuDetailContext() {
  const context = useContext(MenuDetailContext);
  if (!context) {
    throw new Error(
      "useMenuDetailContext must be used within a MenuDetailProvider"
    );
  }
  return context;
}
