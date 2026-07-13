import { AxiosResponse } from "axios";
import { http } from "../../axios/http";

const prefix = "stores/v1/sessions";

async function createSession(qrCode: string): Promise<AxiosResponse<void>> {
  return await http.post<void>(`${prefix}`, {
    qrCode,
  });
}

export const httpSession = {
  createSession,
};
