"use client";

import { Exception } from "@ssurak/api/types/exception.interface";
import { AxiosError } from "axios";
import ErrorFallbackView from "../common/ErrorFallbackView";

export default function CartError({
  error,
  reset,
}: {
  error: Error | AxiosError<Exception>;
  reset: () => void;
}) {
  return (
    <ErrorFallbackView
      error={error}
      errorTitle={"장바구니 정보를 불러오는 중 오류가 발생했습니다."}
      reset={reset}
    ></ErrorFallbackView>
  );
}
