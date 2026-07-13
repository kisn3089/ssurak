import { useAuthInfo } from "@ssurak/auth/providers/AuthenticationProvider";
import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { http } from "../core/axios/http";
import { pathToQueryKey } from "../utils/pathToQueryKey";

type QueryParams<Data, Error, SelectedData> = {
  queryOptions?: Omit<
    UseSuspenseQueryOptions<Data, Error, SelectedData>,
    "queryKey" | "queryFn"
  >;
  onSuccess?: (data: Data) => void;
};
export default function useSuspenseWithAuth<
  Data,
  SelectedData = Data,
  Error = unknown,
>(url: string, queryParams?: QueryParams<Data, Error, SelectedData>) {
  const { authInfo } = useAuthInfo();

  const { queryOptions, onSuccess } = queryParams ?? {};
  return useSuspenseQuery<Data, Error, SelectedData>({
    queryKey: pathToQueryKey(url),
    queryFn: async () => {
      const result = await http
        .get(url, {
          headers: {
            Authorization: `Bearer ${authInfo.accessToken}`,
          },
        })
        .then((res) => res.data);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    },
    ...queryOptions,
  });
}
