"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./buttons/button";

/** 현재 페이지 주변으로 최대 `size`개의 번호만 노출한다(총 페이지가 많아도 폭이 고정). */
function buildWindow(page: number, totalPages: number, size: number): number[] {
  const start = Math.max(
    1,
    Math.min(page - Math.floor(size / 2), totalPages - size + 1)
  );
  const length = Math.min(size, totalPages);

  return Array.from({ length }, (_, index) => start + index);
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 노출할 페이지 번호 개수. */
  windowSize?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * 표현만 담당한다. URL 쿼리 갱신이든 로컬 state든 이동 방식은 소비자(`onPageChange`)가 정한다.
 * portal은 state, community는 `?page=` 라우팅으로 같은 컴포넌트를 쓴다.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  windowSize = 5,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildWindow(page, totalPages, windowSize);

  return (
    <nav
      aria-label="페이지 탐색"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="이전 페이지"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </Button>

      {pages.map((value) => (
        <Button
          key={value}
          variant={value === page ? "default" : "ghost"}
          size="icon-sm"
          aria-label={`${value}페이지`}
          aria-current={value === page ? "page" : undefined}
          disabled={disabled}
          onClick={() => onPageChange(value)}
        >
          {value}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="다음 페이지"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  );
}
