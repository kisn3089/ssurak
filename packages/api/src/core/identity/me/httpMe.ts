import { Owner } from "../../../types/owner/owner.interface";
import { http } from "../../axios/http";
import { AxiosRequestConfig } from "axios";

const prefix = "/identity/v1/me";

async function fetchMe(): Promise<Owner> {
  const response = await http.get<Owner>(`${prefix}`);
  return response.data;
}

export type HealthCheckResponse = {
  status: string;
  timestamp: string;
};
async function fetchHealthCheck(
  config?: AxiosRequestConfig
): Promise<HealthCheckResponse> {
  const response = await http.get<HealthCheckResponse>(`/`, config);
  return response.data;
}

export const httpMe = {
  fetchMe,
  fetchHealthCheck,
};
