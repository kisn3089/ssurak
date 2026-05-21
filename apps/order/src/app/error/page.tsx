"use client";

import { CircleAlert } from "lucide-react";

export default function RootErrorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center break-keep">
      <CircleAlert className="w-16 h-16 text-destructive mb-4" />
      <h1 className="md:text-lg font-bold">
        {"서버가 불안정합니다. 다시 스캔해주세요."}
      </h1>
    </div>
  );
}
