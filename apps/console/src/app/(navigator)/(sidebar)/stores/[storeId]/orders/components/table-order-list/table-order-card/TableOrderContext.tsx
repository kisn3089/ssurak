"use client";

import { createContext, useContext } from "react";
import type { SummarizedTableWithSessions } from "@spaceorder/db";

/**
 * TableOrder Compound Component의 Context 인터페이스
 * - state: 테이블 및 세션 관련 상태
 * - meta: storeId, tableId 등 메타 정보
 */

// State
export interface TableOrderState {
  summarizedTable: SummarizedTableWithSessions;
  session: SummarizedTableWithSessions["tableSessions"] extends
    | (infer T)[]
    | undefined
    ? T | null
    : never;
  isActivatedTable: boolean;
  isSelected: boolean;
}

// Meta
export interface TableOrderMeta {
  tableId: string;
}

// Context Value
export interface TableOrderContextValue {
  state: TableOrderState;
  meta: TableOrderMeta;
}

export const TableOrderContext = createContext<TableOrderContextValue | null>(
  null
);

export function useTableOrderContext() {
  const context = useContext(TableOrderContext);
  if (!context) {
    throw new Error(
      "useTableOrderContext must be used within a TableOrderProvider"
    );
  }
  return context;
}
