import { pathToQueryKey } from "@spaceorder/api/utils";
import {
  LAST_ACCESSED_STORE_ID,
  OrderBoardByStore,
  PublicOrderWithItem,
  PublicTable,
} from "@spaceorder/db";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useSetCacheByStoreBoard = () => {
  const params = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();

  const setCache = (tableBoard: OrderBoardByStore, storeId?: string) => {
    const resolvedStoreId = storeId ?? params.storeId;

    tableBoard.forEach((tableWithSessions) => {
      const { tableSessions, ...table } = tableWithSessions;

      queryClient.setQueryData<PublicTable>(
        pathToQueryKey(
          `/stores/v1/${resolvedStoreId}/tables/${table.publicId}`
        ),
        table
      );

      const orders: PublicOrderWithItem[] = tableSessions?.[0]?.orders ?? [];
      queryClient.setQueryData<PublicOrderWithItem[]>(
        pathToQueryKey(
          `/orders/v1/tables/${table.publicId}/active-session/orders`
        ),
        orders
      );
    });
  };

  const setStoreInLocalStorage = (storeId: string) => {
    localStorage.setItem(LAST_ACCESSED_STORE_ID, storeId);
  };

  return { setCache, setStoreInLocalStorage };
};
