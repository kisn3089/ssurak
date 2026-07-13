import { Owner } from "../../../types/owner/owner.interface";
import { http } from "../../axios/http";

const prefix = "/identity/v1/owners";

async function fetchList(): Promise<Owner[]> {
  const response = await http.get<Owner[]>(`${prefix}`);
  return response.data;
}

async function fetchUnique(publicId: string): Promise<Owner> {
  const response = await http.get<Owner>(`${prefix}/${publicId}`);
  return response.data;
}

export const httpOwners = { fetchList, fetchUnique };
