import { usePathname, useSearchParams } from "next/navigation";

export default function useQueryParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const addParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // 필터가 바뀌면 기존 페이지 번호는 의미가 없으므로 1페이지로 되돌린다.
    params.delete("page");

    window.history.pushState(null, "", `${pathname}?${params}`);
  };

  const deleteParams = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    window.history.pushState(null, "", `${pathname}?${params}`);
  };

  const getParams = (key: string) => {
    return searchParams.get(key) || "";
  };

  return { addParams, deleteParams, getParams };
}
