"use client";

import { useState } from "react";
import type { PublicMenu, MenuOptionEntry } from "@spaceorder/db/types";
import {
  MenuDetailContext,
  type MenuDetailContextValue,
  type SelectedOptions,
} from "./MenuDetailContext";

interface MenuDetailProviderProps {
  menu: PublicMenu;
  children: React.ReactNode;
}

export function MenuDetailProvider({
  menu,
  children,
}: MenuDetailProviderProps) {
  const requiredOptions = toOptionEntries(menu.requiredOptions);
  const customOptions = toOptionEntries(menu.customOptions);
  const allOptions = [...requiredOptions, ...customOptions];

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    () => ({
      required: toDefaultSelection(requiredOptions),
      custom: toDefaultSelection(customOptions),
    })
  );

  const selectRequiredOption = (groupKey: string, optionKey: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      required: new Map(prev.required).set(groupKey, optionKey),
    }));
  };

  const selectCustomOption = (groupKey: string, optionKey: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      custom: new Map(prev.custom).set(groupKey, optionKey),
    }));
  };

  const allSelectedOptions = new Map<string, string>([
    ...selectedOptions.required,
    ...selectedOptions.custom,
  ]);

  const contextValue: MenuDetailContextValue = {
    state: { menu, quantity, selectedOptions },
    actions: { setQuantity, selectRequiredOption, selectCustomOption },
    meta: { requiredOptions, customOptions, allOptions, allSelectedOptions },
  };

  return (
    <MenuDetailContext.Provider value={contextValue}>
      {children}
    </MenuDetailContext.Provider>
  );
}

function toOptionEntries(
  options: PublicMenu["requiredOptions"] | PublicMenu["customOptions"]
): MenuOptionEntry[] {
  if (!options) return [];
  return Object.entries(options).map(([key, value]) => ({
    key,
    optionInfo: value,
  }));
}

function toDefaultSelection(entries: MenuOptionEntry[]): Map<string, string> {
  return new Map(
    entries.map(({ key, optionInfo }) => [key, optionInfo.defaultKey])
  );
}
