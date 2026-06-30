"use client";

import MenuCounter from "./MenuCounter";
import { useMenuDetailContext } from "./MenuDetailContext";

export function MenuDetailCounter() {
  const {
    state: { menu, quantity },
    actions: { setQuantity },
  } = useMenuDetailContext();

  return (
    <MenuCounter
      isAvailable={menu.isAvailable}
      quantity={quantity}
      changeQuantity={setQuantity}
    />
  );
}
