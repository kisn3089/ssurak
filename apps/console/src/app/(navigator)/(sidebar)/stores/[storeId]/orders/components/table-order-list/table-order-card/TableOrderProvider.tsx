"use client";

import { useParams } from "next/navigation";
import type { SummarizedTableWithSessions } from "@spaceorder/db";
import {
  TableOrderContext,
  type TableOrderContextValue,
} from "./TableOrderContext";

interface TableOrderProviderProps {
  summarizedTable: SummarizedTableWithSessions;
  children: React.ReactNode;
}

export function TableOrderProvider({
  summarizedTable,
  children,
}: TableOrderProviderProps) {
  const params = useParams<{ storeId: string; tableId: string }>();

  const session = summarizedTable.tableSessions?.[0] ?? null;
  const isActivatedTable = summarizedTable.isActive === true;
  const isSelected = params.tableId === summarizedTable.publicId;

  const contextValue: TableOrderContextValue = {
    state: {
      summarizedTable,
      session,
      isActivatedTable,
      isSelected,
    },
    meta: { tableId: summarizedTable.publicId },
  };

  return (
    <TableOrderContext.Provider value={contextValue}>
      {children}
    </TableOrderContext.Provider>
  );
}
