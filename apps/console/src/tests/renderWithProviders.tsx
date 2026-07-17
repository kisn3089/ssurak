import AuthenticationProvider from "@ssurak/auth/providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderResult } from "@testing-library/react";
import { Suspense } from "react";

/**
 * Suspense 쿼리·뮤테이션을 쓰는 컴포넌트를 실제 Provider 트리로 렌더한다.
 * HTTP 요청은 MSW(src/tests/msw)가 가로채므로 훅을 모킹하지 않는다.
 */
export function renderWithProviders(ui: React.ReactNode): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <AuthenticationProvider serverSignOut={() => {}}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div role="status">불러오는 중</div>}>
          {ui}
        </Suspense>
      </QueryClientProvider>
    </AuthenticationProvider>
  );
}
