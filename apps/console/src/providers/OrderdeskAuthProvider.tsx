"use client";

import AuthenticationProvider from "@spaceorder/auth/providers/AuthenticationProvider";
import { COOKIE_TABLE } from "@spaceorder/db/constants";
import { useRouter } from "next/navigation";
import AxiosInterceptor from "@/lib/AxiosInterceptor";
import { clearServerCookie } from "@/app/common/servers/cookies";

export function OrderdeskAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const signOut = () => {
    void (async () => {
      try {
        await Promise.all([
          clearServerCookie(COOKIE_TABLE.ACCESS_TOKEN),
          clearServerCookie(COOKIE_TABLE.REFRESH),
        ]);
      } catch (error) {
        console.error("Error occurred while clearing cookies:", error);
      } finally {
        router.push("/signin");
      }
    })();
  };

  return (
    <AuthenticationProvider serverSignOut={signOut}>
      <AxiosInterceptor>{children}</AxiosInterceptor>
    </AuthenticationProvider>
  );
}
