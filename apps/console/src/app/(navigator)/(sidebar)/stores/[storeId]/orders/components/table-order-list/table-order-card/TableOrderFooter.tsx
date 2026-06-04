"use client";

import { CardFooter } from "@spaceorder/ui/components/card";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import SessionExpireTime from "@/app/common/orders/SessionExpireTime";
import { useTableOrderContext } from "./TableOrderContext";

export function TableOrderFooter() {
  const {
    state: { session },
  } = useTableOrderContext();

  return (
    <CardFooter className="p-2 min-h-9">
      <ActivityRender mode={session?.expiresAt ? "visible" : "hidden"}>
        <SessionExpireTime expiresAt={session?.expiresAt} />
      </ActivityRender>
    </CardFooter>
  );
}
