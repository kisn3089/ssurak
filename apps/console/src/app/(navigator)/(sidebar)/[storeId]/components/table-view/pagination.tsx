"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@ssurak/ui/components/buttons/button";
import usePagination from "../../hooks/usePagination";

interface PaginationProps {
  dataLength: number;
}

/**
 * URL query parameter를 기반으로 페이지네이션을 구현하는 컴포넌트입니다.
 * @param dataLength 전체 데이터의 길이
 * @returns 페이지네이션 컴포넌트
 */
export function Pagination({ dataLength }: PaginationProps) {
  const { totalPages, currentPage, setPage, pages } = usePagination(dataLength);

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="페이지 탐색"
      className={"flex items-center justify-center gap-1"}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => setPage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </Button>

      {pages.map((value) => (
        <Button
          key={value}
          variant={value === currentPage ? "default" : "ghost"}
          size="icon-sm"
          aria-label={`${value}페이지`}
          aria-current={value === currentPage ? "page" : undefined}
          onClick={() => setPage(value)}
        >
          {value}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => setPage(currentPage + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  );
}
