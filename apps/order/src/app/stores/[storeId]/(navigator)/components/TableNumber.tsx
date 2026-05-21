"use client";

import useSuspenseWithSession from "@spaceorder/api/hooks/useSuspenseWithSession";
import { StoreContext } from "@spaceorder/db/types/session.type";

export default function TableNumber() {
  const { data: tableNumber } = useSuspenseWithSession<StoreContext, number>(
    "/stores/v1/sessions/me/store-context",
    {
      queryOptions: {
        select: (storeContext) => storeContext.table.tableNumber,
      },
    }
  );

  return <p className="font-semibold">{tableNumber}</p>;
}
