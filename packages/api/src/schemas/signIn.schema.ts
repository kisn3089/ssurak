import z from "zod";
import { createOwnerPayloadSchema } from "./model/owner.schema";

/**
 * 백엔드(request/signIn.schema.ts)와 의도적으로 다릅니다 — schema-sync에서
 * DRIFT로 잡혀도 정상입니다. 백엔드는 자격 증명 일치만 검증하므로 `.min(1)`
 * 두 개뿐이고, 프론트는 폼 UX를 위해 이메일 형식 검증과 한국어 에러 메시지를
 * 유지합니다. 비밀번호 복잡도 규칙은 정책 노출·기존 유저 거짓 거부를 피하기
 * 위해 양쪽 모두 로그인에 적용하지 않습니다.
 */
export const signInPayloadSchema = z.object({
  email: createOwnerPayloadSchema.shape.email,
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
