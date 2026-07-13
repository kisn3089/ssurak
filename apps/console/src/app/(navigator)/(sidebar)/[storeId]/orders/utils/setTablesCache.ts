import { pathToQueryKey } from "@ssurak/api/utils/pathToQueryKey";
import {
  ActiveSessionResponse,
  OrderBoardByStoreResponse,
} from "@ssurak/api/types/board/board.interface";
import { Table } from "@ssurak/api/types/table/table.interface";
import { QueryClient } from "@tanstack/react-query";

export function setTablesCache(
  tableBoard: OrderBoardByStoreResponse,
  queryClient: QueryClient,
  storeId: string
) {
  tableBoard.forEach((tableWithSessions) => {
    const { tableSessions, ...table } = tableWithSessions;

    queryClient.setQueryData<Table>(
      pathToQueryKey(`/stores/v1/${storeId}/tables/${table.publicId}`),
      table
    );

    const session: ActiveSessionResponse = tableSessions?.[0] ?? null;
    queryClient.setQueryData<ActiveSessionResponse>(
      pathToQueryKey(`/orders/v1/tables/${table.publicId}/active-session`),
      session
    );
  });
}
