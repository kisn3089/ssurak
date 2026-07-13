"use client";

import useQueryWithSession from "@ssurak/api/hooks/useQueryWithSession";
import { StoreContextResponse } from "@ssurak/api/types/store/store.interface";

export default function StoreName() {
  const { data: storeName } = useQueryWithSession<StoreContextResponse, string>(
    "/stores/v1/sessions/me/store-context",
    {
      queryOptions: {
        select: (storeContext) => storeContext.table.store.name,
      },
    }
  );

  return <h1 className="md:text-lg font-bold truncate">{storeName}</h1>;
}
