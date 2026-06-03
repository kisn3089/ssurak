"use client";

import AuthenticationProvider from "@spaceorder/auth/providers/AuthenticationProvider";
import { useRouter } from "next/navigation";
import AxiosInterceptor from "@/lib/AxiosInterceptor";
import { clearAuthCookies } from "@/app/common/servers/cookies";

export function OrderdeskAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const signOut = () => {
    void (async () => {
      try {
        await clearAuthCookies();
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
