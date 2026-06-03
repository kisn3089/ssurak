"use client";

import { refreshAccessToken } from "@/app/common/servers/refreshAccessToken";
import { setupAuthInterceptor } from "@spaceorder/api";
import { useAuthInfo } from "@spaceorder/auth";
import { toast } from "@spaceorder/ui/components/sonner";
import React, { ReactNode, useEffect, useRef } from "react";

export default function AxiosInterceptor({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { setAuthInfo, signOut } = useAuthInfo();

  const lastForbiddenNoticeAtRef = useRef(0);

  useEffect(() => {
    const forbiddenNotice = () => {
      const now = Date.now();
      if (now - lastForbiddenNoticeAtRef.current < 1000) {
        return;
      }

      lastForbiddenNoticeAtRef.current = now;
      toast.error("해당 자원에 대한 권한이 없습니다.");
    };

    setupAuthInterceptor({
      refreshAccessToken,
      setAuthInfo,
      signOut,
      forbiddenNotice,
    });
  }, [setAuthInfo, signOut]);

  return <>{children}</>;
}
