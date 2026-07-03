import { LAST_ACCESSED_STORE_ID, OrderBoardByStore } from "@spaceorder/db";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { setTablesCache } from "../utils/setTablesCache";

export const useSetCacheByStoreBoard = () => {
  const params = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();

  const setCache = (tableBoard: OrderBoardByStore, storeId?: string) => {
    const resolvedStoreId = storeId ?? params.storeId;

    setTablesCache(tableBoard, queryClient, resolvedStoreId);
  };

  const setStoreInLocalStorage = (storeId: string) => {
    localStorage.setItem(LAST_ACCESSED_STORE_ID, storeId);
  };

  return { setCache, setStoreInLocalStorage };
};
