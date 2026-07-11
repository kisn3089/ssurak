import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTableParams, httpTables, UpdateTableParams } from "./httpTable";
import { pathToQueryKey } from "../../../utils/pathToQueryKey";
import { PublicTable } from "@spaceorder/db";
import { HttpAxiosError } from "../../axios";

export default function useTableMutation(storeId: string) {
  const queryClient = useQueryClient();

  const invalidQueryKeys = [
    pathToQueryKey(`/stores/v1/${storeId}/tables`),
    pathToQueryKey(`/orders/v1/stores/${storeId}/board`),
  ];

  const invalidQueries = () => {
    invalidQueryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const createTable = useMutation<
    PublicTable,
    HttpAxiosError,
    CreateTableParams
  >({
    mutationFn: (args: CreateTableParams) => httpTables.createTable(args),
    onSuccess: invalidQueries,
  });

  const updateTable = useMutation<
    PublicTable,
    HttpAxiosError,
    UpdateTableParams
  >({
    mutationFn: (args: UpdateTableParams) => httpTables.fetchUpdate(args),
    onSuccess: invalidQueries,
  });

  return { createTable, updateTable };
}
