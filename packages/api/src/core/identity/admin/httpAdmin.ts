import { Admin } from "../../../types/admin/admin.interface";
import { http } from "../../axios/http";

const prefix = "/identity/v1/admins";

async function fetchList(): Promise<Admin[]> {
  const response = await http.get<Admin[]>(`${prefix}`);
  return response.data;
}

async function fetchUnique(publicId: string): Promise<Admin> {
  const response = await http.get<Admin>(`${prefix}/${publicId}`);
  return response.data;
}

export const httpAdmin = { fetchList, fetchUnique };
