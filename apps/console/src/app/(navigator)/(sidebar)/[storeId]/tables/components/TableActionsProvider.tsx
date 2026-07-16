"use client";

import { HttpAxiosError } from "@ssurak/api/core/axios/http";
import { httpTableErrors } from "@ssurak/api/core/store/table/httpTableErrors";
import useTableMutation from "@ssurak/api/core/store/table/useTableMutation";
import { toast } from "@ssurak/ui/components/sonner";
import { useParams } from "next/navigation";
import { createContext, useContext } from "react";

export const activatePrefix = (isActive: boolean) => (isActive ? "비" : "");

export const tableActionToastId = {
  activate: (publicId: string) => `table-activate-${publicId}`,
  delete: (publicId: string) => `table-delete-${publicId}`,
};

const promiseToastTile = {
  loading: (tableNumber: string, isActive: boolean) =>
    `${tableNumber} 테이블 ${activatePrefix(isActive)}활성화 중...`,
  success: (tableNumber: string, isActive: boolean) =>
    `${tableNumber} 테이블이 ${activatePrefix(!isActive)}활성화되었습니다.`,
  error: (tableNumber: string, isActive: boolean) =>
    `${tableNumber} 테이블 ${activatePrefix(isActive)}활성화에 실패했습니다.`,
};

export default function TableActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { storeId } = useParams<{ storeId: string }>();
  const { updateTable, deleteTable } = useTableMutation(storeId);

  const toggleActivateOnBackground = async (table: ToggleActivateParams) => {
    const updateTablePromise = updateTable.mutateAsync({
      tableId: table.publicId,
      updateTablePayload: { isActive: !table.isActive },
    });

    toast.promise(updateTablePromise, {
      id: tableActionToastId.activate(table.publicId),
      loading: promiseToastTile.loading(table.tableNumber, table.isActive),
      success: promiseToastTile.success(table.tableNumber, table.isActive),
      error: (error: HttpAxiosError) => ({
        message: promiseToastTile.error(table.tableNumber, table.isActive),
        description: httpTableErrors.patch(error),
        duration: Infinity,
        closeButton: true,
        action: {
          label: "재시도",
          onClick: () => toggleActivateOnBackground(table),
        },
      }),
      position: "top-center",
    });
  };

  const deleteTableOnBackground = async (params: DeleteTableParams) => {
    const deleteTablePromise = deleteTable.mutateAsync({
      tableId: params.publicId,
    });

    toast.promise(deleteTablePromise, {
      id: tableActionToastId.delete(params.publicId),
      loading: `${params.tableNumber} 테이블 삭제 중...`,
      success: `${params.tableNumber} 테이블이 삭제되었습니다.`,
      error: (error: HttpAxiosError) => ({
        message: `${params.tableNumber} 테이블 삭제에 실패했습니다.`,
        description: httpTableErrors.delete(error),
        duration: Infinity,
        closeButton: true,
        action: {
          label: "재시도",
          onClick: () => deleteTableOnBackground(params),
        },
      }),
      position: "top-center",
    });
  };

  const tableActions: TableAction = {
    toggleActivateOnBackground,
    deleteTableOnBackground,
  };

  return (
    <TableActionsContext.Provider value={tableActions}>
      {children}
    </TableActionsContext.Provider>
  );
}

// ----------- useContext -------------
export interface ToggleActivateParams {
  publicId: string;
  tableNumber: string;
  isActive: boolean;
}

interface DeleteTableParams {
  publicId: string;
  tableNumber: string;
}

interface TableAction {
  toggleActivateOnBackground: (table: ToggleActivateParams) => Promise<void>;
  deleteTableOnBackground: (params: DeleteTableParams) => Promise<void>;
}

const TableActionsContext = createContext<TableAction | null>(null);

export const useTableActionsContext = () => {
  const context = useContext(TableActionsContext);
  if (!context) {
    throw new Error(
      "useTableActionsContext must be used within a TableActionsProvider"
    );
  }
  return context;
};
