"use client";

import useSuspenseWithSession from "@spaceorder/api/hooks/useSuspenseWithSession";
import { Cart } from "@spaceorder/db/types";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import { Button } from "@spaceorder/ui/components/button";
import { ConciergeBell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CartLink() {
  const { storeId } = useParams<{ storeId: string }>();

  const { data: cartMenuCount } = useSuspenseWithSession<Cart, number>(
    "/carts/v1/sessions/carts",
    {
      queryOptions: {
        select: (cart) => {
          return cart.menus.length;
        },
      },
    }
  );

  return (
    <Button variant={"secondary"} className="relative" asChild>
      <Link href={`/stores/${storeId}/carts`}>
        <ConciergeBell />
        <ActivityRender mode={cartMenuCount > 0 ? "visible" : "hidden"}>
          <div className="absolute top-0 right-0 w-4 h-4 grid place-content-center bg-black text-white rounded-full text-[0.6rem] font-semibold">
            {cartMenuCount}
          </div>
        </ActivityRender>
      </Link>
    </Button>
  );
}
