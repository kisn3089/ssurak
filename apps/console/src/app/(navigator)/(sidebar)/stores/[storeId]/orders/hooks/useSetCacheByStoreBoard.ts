import { pathToQueryKey } from "@spaceorder/api/utils";
import {
  ActiveSessionResponse,
  LAST_ACCESSED_STORE_ID,
  OrderBoardByStore,
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

      const session: ActiveSessionResponse = tableSessions?.[0] ?? null;
      queryClient.setQueryData<ActiveSessionResponse>(
        pathToQueryKey(`/orders/v1/tables/${table.publicId}/active-session`),
        session
      );
    });
  };

  const setStoreInLocalStorage = (storeId: string) => {
    localStorage.setItem(LAST_ACCESSED_STORE_ID, storeId);
  };

  return { setCache, setStoreInLocalStorage };
};
