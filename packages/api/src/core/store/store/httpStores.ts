import { Store } from "../../../types/store/store.interface";
import { http } from "../../axios/http";

const prefix = `/stores/v1`;

async function fetchList(): Promise<Store[]> {
  const response = await http.get<Store[]>(`${prefix}`);
  return response.data;
}

async function fetchUnique(publicId: string): Promise<Store> {
  const response = await http.get<Store>(`${prefix}/${publicId}`);
  return response.data;
}

export const httpStores = {
  fetchList,
  fetchUnique,
};
