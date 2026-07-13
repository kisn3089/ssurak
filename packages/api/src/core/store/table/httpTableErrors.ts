import { HttpAxiosError } from "../../axios/http";

/**
 * Table 조회/생성/수정/삭제 시 발생 가능한 백엔드 오류를 사용자 문구로 변환한다.
 * (FormErrorAndRetry 등에서 재시도 안내 메시지로 사용)
 *
 * 오류 출처 (apps/ssurak `:storeId/tables` 라우트 기준):
 * - JwtAuthGuard: 401 UNAUTHORIZED — 토큰 만료(419)는 axios 인터셉터가 자동 갱신하므로 여기서 다루지 않는다.
 * - StoreAccessGuard: 404 NOT_FOUND(매장 없음), 403 FORBIDDEN(매장 소유자 불일치)
 * - ZodValidation: 400 (params/query/body 검증 실패)
 * - GlobalExceptionFilter(Prisma):
 *   - P2002 → 409 UNIQUE_CONSTRAINT_VIOLATION (@@unique([storeId, tableNumber]) 위반: 테이블 번호 중복)
 *   - P2025 → 404 RESOURCE_NOT_FOUND (수정·삭제·조회 대상 테이블/매장 없음)
 *   - P2003 → 400 FOREIGN_KEY_CONSTRAINT_VIOLATION (Order·TableSession이 연결된 테이블 삭제 제한: onDelete Restrict)
 *   - 그 외 → 400 PRISMA_ERROR / 500 INTERNAL_SERVER_ERROR
 */
export const httpTableErrors = {
  post: postTableErrors,
  get: getTableErrors,
  patch: patchTableErrors,
  delete: deleteTableErrors,
};

/** 모든 테이블 요청에 공통으로 발생할 수 있는 인증/권한/서버 오류를 처리한다. */
function commonTableError(error: HttpAxiosError, fallback: string): string {
  const status = error.response?.data?.status;
  switch (status) {
    case 401:
      return "로그인이 만료되었어요. 다시 로그인해 주세요.";
    case 403:
      return "이 매장에 접근할 권한이 없어요.";
    default:
      return fallback;
  }
}

function postTableErrors(error: HttpAxiosError) {
  const status = error.response?.data?.status;
  switch (status) {
    case 400:
      return "입력한 테이블 정보가 올바르지 않아요. 다시 확인해 주세요.";
    case 404:
      return "테이블을 추가할 매장을 찾을 수 없어요.";
    case 409:
      return "이미 존재하는 테이블 번호예요. 다른 번호를 입력해 주세요.";
    default:
      return commonTableError(
        error,
        "일시적인 서버 오류로 저장하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
  }
}

function getTableErrors(error: HttpAxiosError) {
  const status = error.response?.data?.status;
  switch (status) {
    case 400:
      return "잘못된 요청이에요. 다시 시도해 주세요.";
    case 404:
      return "해당 테이블을 찾을 수 없어요.";
    default:
      return commonTableError(
        error,
        "일시적인 서버 오류로 데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
      );
  }
}

function patchTableErrors(error: HttpAxiosError) {
  const status = error.response?.data?.status;
  switch (status) {
    case 400:
      return "입력한 테이블 정보가 올바르지 않아요. 다시 확인해 주세요.";
    case 404:
      return "수정하려는 테이블을 찾을 수 없어요.";
    case 409:
      return "이미 존재하는 테이블 번호예요. 다른 번호를 입력해 주세요.";
    default:
      return commonTableError(
        error,
        "일시적인 서버 오류로 수정하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
  }
}

function deleteTableErrors(error: HttpAxiosError) {
  const status = error.response?.data?.status;
  const code = error.response?.data?.code;
  switch (status) {
    case 400:
      // P2003: Order·TableSession이 연결된 테이블은 onDelete Restrict로 삭제가 막힌다.
      if (code === "FOREIGN_KEY_CONSTRAINT_VIOLATION") {
        return "주문 내역이나 이용 중인 세션이 있는 테이블은 삭제할 수 없어요.";
      }
      return "잘못된 요청이에요. 다시 시도해 주세요.";
    case 404:
      return "삭제하려는 테이블을 찾을 수 없어요.";
    default:
      return commonTableError(
        error,
        "일시적인 서버 오류로 삭제하지 못했어요. 잠시 후 다시 시도해 주세요."
      );
  }
}
