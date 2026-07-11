"use client";

import { CardFooter } from "@spaceorder/ui/components/layouts/card";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import SessionExpireTime from "@/app/common/orders/SessionExpireTime";
import { BoardSessionWithOrders } from "@spaceorder/db/types";

type TableOrderFooterProps = {
  expiresAt: BoardSessionWithOrders["expiresAt"] | undefined;
};

export function TableOrderFooter({ expiresAt }: TableOrderFooterProps) {
  return (
    <CardFooter className="p-2 min-h-9">
      <ActivityRender value={expiresAt}>
        {(expiresAt) => <SessionExpireTime expiresAt={expiresAt} />}
      </ActivityRender>
    </CardFooter>
  );
}
