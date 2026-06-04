"use client";

import { use } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import TableOrderDetail from "./table-order-detail/TableOrderDetail";
import ErrorFallback from "@/components/ErrorFallback";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TableOrderDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; tableId: string }>;
}) {
  const { storeId, tableId } = use(params);
  return (
    // OrdersPage와 동일하게 스타일을 맞춰야 한다.
    <div className="overflow-hidden rounded-md border h-full flex flex-col justify-between shadow-sm w-xl min-w-xs">
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <Suspense fallback={<LoadingSpinner />}>
          <TableOrderDetail params={{ storeId, tableId }} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ErrorFallbackComponent(args: FallbackProps) {
  return (
    <ErrorFallback {...args}>
      <div className="h-full grid place-items-center">
        <p className="font-semibold">
          해당 테이블의 주문 내역을 찾을 수 없습니다.
        </p>
      </div>
    </ErrorFallback>
  );
}
