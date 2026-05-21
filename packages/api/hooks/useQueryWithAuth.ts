import { useAuthInfo } from "@spaceorder/auth";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { http } from "../core";
import { pathToQueryKey } from "../utils/pathToQueryKey";

type QueryParams<Data, Error, SelectedData> = {
  queryOptions?: Omit<
    UseQueryOptions<Data, Error, SelectedData>,
    "queryKey" | "queryFn"
  >;
  enabled?: boolean;
  onSuccess?: (data: Data) => void;
};
export default function useQueryWithAuth<
  Data,
  SelectedData = Data,
  Error = unknown,
>(url: string, queryParams?: QueryParams<Data, Error, SelectedData>) {
  const { authInfo } = useAuthInfo();

  const { queryOptions, enabled, onSuccess } = queryParams ?? {};
  return useQuery<Data, Error, SelectedData>({
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
    enabled,
    ...queryOptions,
  });
}
