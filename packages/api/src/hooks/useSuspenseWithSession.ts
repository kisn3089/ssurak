import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { http } from "../core/axios/http";
import { makeQueryKey } from "../utils/makeQueryKey";

type QueryParams<Data, Error, SelectedData> = {
  queryOptions?: Omit<
    UseSuspenseQueryOptions<Data, Error, SelectedData>,
    "queryKey" | "queryFn"
  >;
  onSuccess?: (data: Data) => void;
};

export default function useSuspenseWithSession<
  Data,
  SelectedData = Data,
  Error = unknown,
>(url: string, queryParams?: QueryParams<Data, Error, SelectedData>) {
  const { queryOptions, onSuccess } = queryParams ?? {};

  return useSuspenseQuery<Data, Error, SelectedData>({
    queryKey: makeQueryKey(url),
    queryFn: async () => {
      const result = await http.get(url).then((res) => res.data);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    },
    ...queryOptions,
  });
}
