import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const MAX_SIZE = 10;
const WINDOW_SIZE = 5;

export default function usePagination(dataLength: number) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const parsedPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    window.history.pushState(null, "", `${pathname}?${params}`);
  };

  const totalPages = Math.max(1, Math.ceil(dataLength / MAX_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pages = buildWindow(currentPage, totalPages, WINDOW_SIZE);

  useEffect(() => {
    if (page <= totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", totalPages.toString());
    window.history.replaceState(null, "", `${pathname}?${params}`);
  }, [page, totalPages, searchParams, pathname]);

  return {
    totalPages,
    currentPage,
    setPage,
    pages,
  };
}

/** 현재 페이지 주변으로 최대 `size`개의 번호만 노출한다(총 페이지가 많아도 폭이 고정). */
function buildWindow(page: number, totalPages: number, size: number): number[] {
  const start = Math.max(
    1,
    Math.min(page - Math.floor(size / 2), totalPages - size + 1)
  );
  const length = Math.min(size, totalPages);

  return Array.from({ length }, (_, index) => start + index);
}
