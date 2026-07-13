"use client";

import useSuspenseWithSession from "@ssurak/api/hooks/useSuspenseWithSession";
import { StoreContextResponse } from "@ssurak/api/types/store/store.interface";

export default function TableNumber() {
  const { data: tableNumber } = useSuspenseWithSession<
    StoreContextResponse,
    string
  >("/stores/v1/sessions/me/store-context", {
    queryOptions: {
      select: (storeContext) => storeContext.table.tableNumber,
    },
  });

  return (
    <span className="font-semibold flex items-baseline gap-x-2">
      {tableNumber}
      <span className="text-xs text-muted-foreground">테이블</span>
    </span>
  );
}
