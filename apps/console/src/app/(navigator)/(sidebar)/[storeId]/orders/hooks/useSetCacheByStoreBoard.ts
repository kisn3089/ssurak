import { OrderBoardByStoreResponse } from "@ssurak/api/types/board/board.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { setTablesCache } from "../utils/setTablesCache";

export const useSetCacheByStoreBoard = () => {
  const params = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();

  const setCache = (
    tableBoard: OrderBoardByStoreResponse,
    storeId?: string
  ) => {
    const resolvedStoreId = storeId ?? params.storeId;

    setTablesCache(tableBoard, queryClient, resolvedStoreId);
  };

  return { setCache };
};
