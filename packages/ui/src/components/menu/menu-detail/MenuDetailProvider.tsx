"use client";

import { useState } from "react";
import type {
  MenuDetailProviderProps,
  SelectedOptions,
} from "./menu-detail.type";
import { MenuDetailContext, MenuDetailContextValue } from "./MenuDetailContext";
import { deleteNoneTriggeredOptions } from "@ssurak/ui/utils/menu/optionTrigger";
import {
  totalPrice,
  toDefaultSelection,
  toOptionEntries,
} from "@ssurak/ui/utils/menu/optionSelection";

export function MenuDetailProvider({
  menu,
  children,
}: MenuDetailProviderProps) {
  const requiredOptions = toOptionEntries(menu.requiredOptions);
  const customOptions = toOptionEntries(menu.customOptions);
  const allOptions = [...requiredOptions, ...customOptions];

  const [quantity, setQuantity] = useState(menu.quantity ?? 1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    () => ({
      required: toDefaultSelection(requiredOptions),
      custom: toDefaultSelection(customOptions),
    })
  );

  const allSelectedOptions = new Map<string, string>([
    ...selectedOptions.required,
    ...selectedOptions.custom,
  ]);

  const price = totalPrice({
    quantity,
    menuPrice: menu.price,
    allOptions,
    allSelectedOptions,
  });

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

  const snapshotToFetch = () => {
    const deletedNoneTriggeredOptions = deleteNoneTriggeredOptions(
      allOptions,
      selectedOptions.custom,
      allSelectedOptions
    );

    return {
      menuPublicId: menu.publicId,
      menuName: menu.name,
      quantity,
      price,
      ...(selectedOptions["required"].size > 0 && {
        requiredOptions: Object.fromEntries(selectedOptions["required"]),
      }),
      ...(deletedNoneTriggeredOptions.size > 0 && {
        customOptions: Object.fromEntries(deletedNoneTriggeredOptions),
      }),
    };
  };

  const contextValue: MenuDetailContextValue = {
    state: { menu, quantity, selectedOptions },
    actions: {
      setQuantity,
      selectRequiredOption,
      selectCustomOption,
      snapshotToFetch,
    },
    meta: {
      requiredOptions,
      customOptions,
      allSelectedOptions,
      price,
    },
  };

  return (
    <MenuDetailContext.Provider value={contextValue}>
      {children}
    </MenuDetailContext.Provider>
  );
}
