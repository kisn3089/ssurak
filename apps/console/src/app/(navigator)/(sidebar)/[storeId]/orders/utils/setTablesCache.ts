import { pathToQueryKey } from "@spaceorder/api/utils";
import {
  ActiveSessionResponse,
  OrderBoardByStore,
  PublicTable,
} from "@spaceorder/db/types";
import { QueryClient } from "@tanstack/react-query";

export function setTablesCache(
  tableBoard: OrderBoardByStore,
  queryClient: QueryClient,
  storeId: string
) {
  tableBoard.forEach((tableWithSessions) => {
    const { tableSessions, ...table } = tableWithSessions;

    queryClient.setQueryData<PublicTable>(
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
