import { http, HttpResponse } from "msw";

// 백엔드 baseURL은 jsdom에서 http://localhost:8080으로 해석됩니다.
// (packages/api/src/core/axios/http.ts의 resolveSsurakBaseURL 참고)
export const API_BASE_URL = "http://localhost:8080";

export const handlers = [
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({ ok: true });
  }),
];
