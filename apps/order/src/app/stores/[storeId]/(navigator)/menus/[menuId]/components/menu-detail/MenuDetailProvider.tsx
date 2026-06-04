"use client";

import { useState } from "react";
import type { PublicMenu, MenuOptionEntry } from "@spaceorder/db/types";
import {
  MenuDetailContext,
  type MenuDetailContextValue,
  type SelectedOptions,
} from "./MenuDetailContext";
import { AddCartItemPayload, useCartMutations } from "@spaceorder/api/core";
import { deleteNotTriggeredOptions } from "@/utils/optionTrigger";

interface MenuDetailProviderProps {
  menu: PublicMenu;
  children: React.ReactNode;
}

export function MenuDetailProvider({
  menu,
  children,
}: MenuDetailProviderProps) {
  const addCartMutate = useCartMutations().add;

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

  const allSelectedOptions = new Map<string, string>([
    ...selectedOptions.required,
    ...selectedOptions.custom,
  ]);

  const price =
    quantity *
    (menu.price +
      allOptions.reduce((acc, option) => {
        const selectedKey = allSelectedOptions.get(option.key);
        const selectedOption = option.optionInfo.options.find(
          (opt) => opt.key === selectedKey
        );
        return acc + (selectedOption ? selectedOption.price : 0);
      }, 0));

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

  const addCart = () => {
    const deletedNotTriggeredOptions = deleteNotTriggeredOptions(
      allOptions,
      selectedOptions.custom,
      allSelectedOptions
    );
    const cartItem: AddCartItemPayload = {
      menuPublicId: menu.publicId,
      quantity,
      ...(selectedOptions["required"].size > 0 && {
        requiredOptions: Object.fromEntries(selectedOptions["required"]),
      }),
      ...(deletedNotTriggeredOptions.size > 0 && {
        customOptions: Object.fromEntries(deletedNotTriggeredOptions),
      }),
    };

    return addCartMutate.mutateAsync(cartItem);
  };

  const contextValue: MenuDetailContextValue = {
    state: { menu, quantity, selectedOptions },
    actions: { setQuantity, selectRequiredOption, selectCustomOption, addCart },
    meta: {
      requiredOptions,
      customOptions,
      allSelectedOptions,
      price,
      addCartMutate,
    },
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
