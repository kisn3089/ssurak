import MenuCard from "@/app/[qrCode]/(navigator)/menus/components/MenuCard";
import { PublicMenu } from "@spaceorder/db/types";
import { useState } from "react";

export default function MenuList({
  menus,
  priority = false,
}: {
  menus: PublicMenu[];
  priority: boolean;
}) {
  const [touched, setTouched] = useState<string | null>(null);

  return (
    <>
      {menus.map((menu) => (
        <div
          key={menu.publicId}
          className={`rounded-md hover:bg-accent transition-all duration-200 ${touched === menu.publicId ? "bg-accent scale-98 " : "hover:bg-accent hover:scale-98"} ${!menu.isAvailable ? "opacity-50" : ""}`}
          onTouchStart={() => setTouched(menu.publicId)}
          onTouchEnd={() => setTouched(null)}
          onTouchCancel={() => setTouched(null)}
        >
          <MenuCard menu={menu} priority={priority} />
        </div>
      ))}
    </>
  );
}
