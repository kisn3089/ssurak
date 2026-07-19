import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateTableParams,
  DeleteTableParams,
  httpTables,
  UpdateTableParams,
} from "./httpTable";
import { makeQueryKey } from "../../../utils/makeQueryKey";

export default function useTableMutation(storeId: string) {
  const queryClient = useQueryClient();

  const invalidQueryKeys = [
    makeQueryKey(`/stores/v1/${storeId}/tables`),
    makeQueryKey(`/orders/v1/stores/${storeId}/board`),
  ];

  const invalidateQueries = () => {
    invalidQueryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const createTable = useMutation({
    mutationFn: (args: Omit<CreateTableParams, "storeId">) =>
      httpTables.createTable({ storeId, ...args }),
    onSuccess: invalidateQueries,
  });

  const updateTable = useMutation({
    mutationFn: (args: Omit<UpdateTableParams, "storeId">) =>
      httpTables.fetchUpdate({ storeId, ...args }),
    onSuccess: invalidateQueries,
  });

  const deleteTable = useMutation({
    mutationFn: (args: Omit<DeleteTableParams, "storeId">) =>
      httpTables.fetchDelete({ storeId, ...args }),
    onSuccess: invalidateQueries,
  });

  return { createTable, updateTable, deleteTable };
}
