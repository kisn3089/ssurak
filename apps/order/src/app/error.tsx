"use client";

import { Exception } from "@spaceorder/api/types";
import { Button } from "@spaceorder/ui/components/button";
import { AxiosError } from "axios";
import { CircleAlert } from "lucide-react";

export default function MenuErrorPage({
  error,
  reset,
}: {
  error: Error | AxiosError<Exception>;
  reset: () => void;
}) {
  const isAxiosError = error instanceof AxiosError;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center break-keep">
      <CircleAlert className="w-16 h-16 text-destructive mb-4" />
      <h1 className="md:text-lg font-bold">
        {isAxiosError
          ? error.response?.data.message
          : "메뉴를 불러오는 중 오류가 발생했습니다."}
      </h1>
      {!isAxiosError && (
        <Button onClick={reset} className="font-semibold mt-4">
          다시 시도하기
        </Button>
      )}
    </div>
  );
}
