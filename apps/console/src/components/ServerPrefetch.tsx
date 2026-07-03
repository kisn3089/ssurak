"use server";

import { getAccessToken } from "@/app/common/servers/getAccessToken";
import { http, pathToQueryKey } from "@spaceorder/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type ServerPrefetchProps<T> = {
  url: string;
  children: React.ReactNode;
} & (
  | {
      shouldSuccess: true;
      onSuccess?: (data: T, queryClient: QueryClient) => void;
    }
  | { shouldSuccess?: false; onSuccess?: never }
);

export default async function ServerPrefetch<T>({
  url,
  children,
  shouldSuccess,
  onSuccess,
}: ServerPrefetchProps<T>) {
  const queryClient = new QueryClient();
  const accessToken = await getAccessToken();
  const queryKey = pathToQueryKey(url);

  const fetchData = async (): Promise<T> => {
    return http
      .get<T>(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.data);
  };

  /**
   * shouldSuccess가 true인 경우 fetchQuery를 사용하는데 실패할 경우 상위 컴포넌트에서
   * 에러 처리를 할 수 있도록 하기 위함이다.
   * 그렇지 않은 경우 prefetchQuery를 사용하여 에러가 발생하더라도 무시하고 클라이언트에서 시도한다.
   *
   * onSuccess는 fetch가 성공해 데이터가 캐시에 존재할 때만 resolve된 데이터로 실행된다.
   *
   * @see {@link file://./(navigator)/error.tsx}
   */
  if (shouldSuccess) {
    const data = await queryClient.fetchQuery({ queryKey, queryFn: fetchData });
    onSuccess?.(data, queryClient);
  } else {
    await queryClient.prefetchQuery({ queryKey, queryFn: fetchData });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
