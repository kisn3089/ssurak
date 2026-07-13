import { Table } from "../../../types/table/table.interface";
import { http } from "../../axios/http";
import {
  CreateTablePayload,
  UpdateTablePayload,
} from "../../../schemas/model/table.schema";

function prefix(storeId: string) {
  return `/stores/v1/${storeId}/tables`;
}

export type CreateTableParams = {
  storeId: string;
  createTablePayload: CreateTablePayload;
};
async function createTable({
  storeId,
  createTablePayload,
}: CreateTableParams): Promise<Table> {
  const response = await http.post<Table>(prefix(storeId), createTablePayload);

  return response.data;
}

export type FetchTableListParams = { storeId: string };
async function fetchList({ storeId }: FetchTableListParams): Promise<Table[]> {
  const response = await http.get<Table[]>(prefix(storeId));
  return response.data;
}

export type FetchTableUniqueParams = { tableId: string } & FetchTableListParams;
async function fetchUnique({
  tableId,
  storeId,
}: FetchTableUniqueParams): Promise<Table> {
  const response = await http.get<Table>(`${prefix(storeId)}/${tableId}`);
  return response.data;
}

export type UpdateTableParams = {
  tableId: string;
  updateTablePayload: UpdateTablePayload;
} & FetchTableListParams;
async function fetchUpdate({
  tableId,
  storeId,
  updateTablePayload,
}: UpdateTableParams): Promise<Table> {
  const response = await http.patch<Table>(
    `${prefix(storeId)}/${tableId}`,
    updateTablePayload
  );
  return response.data;
}

export const httpTables = { createTable, fetchList, fetchUnique, fetchUpdate };
