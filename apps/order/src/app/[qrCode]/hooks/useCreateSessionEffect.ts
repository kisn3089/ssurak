"use client";

import { createSessionSchema } from "@spaceorder/api/schemas/model/tableSession.schema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import createSession from "../actions/createSession";

export default function useCreateSessionEffect(qrCode: string) {
  const router = useRouter();

  useEffect(
    function createSessionThenFetchStoreContext() {
      (async () => {
        try {
          await validateQrCodeThenCreateSession(qrCode);
          router.replace(`/${qrCode}/menus`, { scroll: false });
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "ZodError") {
            alert("유효하지 않은 QR 코드입니다.");
          }
          alert("세션 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      })();
    },
    [qrCode, router]
  );

  return;
}

async function validateQrCodeThenCreateSession(qrCode: string): Promise<void> {
  const { qrCode: validatedQrCode } = createSessionSchema.parse({
    qrCode,
  });
  const result = await createSession(validatedQrCode);

  if (!result.success && result.error.status === 403) {
    alert("해당 테이블은 주문을 받을 수 없는 상태입니다.");
    console.error("session error: ", result.error);
    // TODO: result.error.status 기반 분기 처리 (예: 403 → 유효하지 않은 QR)
    return;
  }
}
