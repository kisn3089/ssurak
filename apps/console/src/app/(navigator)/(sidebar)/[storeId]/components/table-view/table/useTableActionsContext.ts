import { createContext, useContext } from "react";

export interface Mutation {
  updateActivate: (publicId: string, isActive: boolean) => Promise<void>;
  deleteAction: (publicId: string) => Promise<void>;
}

export interface ToggleTableActivateParams {
  publicId: string;
  name: string;
  isActive: boolean;
}

export interface DeleteTableParams {
  publicId: string;
  name: string;
}

export interface TableAction {
  toggleActivateOnBackground: (
    table: ToggleTableActivateParams
  ) => Promise<void>;
  deleteTableOnBackground: (params: DeleteTableParams) => Promise<void>;
}

export const TableActionsContext = createContext<TableAction | null>(null);

export const useTableActionsContext = () => {
  const context = useContext(TableActionsContext);
  if (!context) {
    throw new Error(
      "useTableActionsContext must be used within a TableActionsProvider"
    );
  }
  return context;
};
