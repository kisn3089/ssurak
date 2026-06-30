"use client";

import { Item } from "@spaceorder/ui/components/item";
import MenuContent from "./MenuContent";
import { useMenuDetailContext } from "./MenuDetailContext";
import { MenuDetailCounter } from "./MenuDetailCounter";

export default function MenuDetailInfo({
  children,
  className,
  description,
}: {
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
}) {
  const {
    state: { menu },
  } = useMenuDetailContext();

  return (
    <Item
      className={`flex flex-col items-center p-0 rounded-none ${className || ""}`}
    >
      {children}
      <MenuContent menu={menu} description={description}>
        <MenuDetailCounter />
      </MenuContent>
    </Item>
  );
}
