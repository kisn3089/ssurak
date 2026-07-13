"use client";

import useSuspenseWithSession from "@ssurak/api/hooks/useSuspenseWithSession";
import { Cart } from "@ssurak/api/types/cart/cart.interface";
import ActivityRender from "@ssurak/ui/components/activity-render/ActivityRender";
import { Button } from "@ssurak/ui/components/buttons/button";
import { ConciergeBell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CountIcon from "@ssurak/ui/components/CountIcon";

export default function CartLink() {
  const { storeId } = useParams<{ storeId: string }>();

  const { data: cartMenuCount } = useSuspenseWithSession<Cart, number>(
    "/carts/v1/sessions/carts",
    { queryOptions: { select: (cart) => cart.menus.length } }
  );

  return (
    <Button variant={"outline"} className="relative" asChild>
      <Link href={`/stores/${storeId}/carts`}>
        <ConciergeBell />
        <ActivityRender value={cartMenuCount || undefined}>
          {(count) => (
            <CountIcon count={count} className="-top-0.5 -right-0.5" />
          )}
        </ActivityRender>
      </Link>
    </Button>
  );
}
