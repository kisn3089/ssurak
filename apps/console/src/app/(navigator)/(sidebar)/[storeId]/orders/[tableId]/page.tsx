"use client";

import { use } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import TableOrderDetail from "./table-order-detail/TableOrderDetail";
import ErrorFallback from "@/app/(navigator)/components/ErrorFallback";
import { Suspense } from "react";
import LoadingSpinner from "@/app/(navigator)/components/LoadingSpinner";
import OrdersPageLayout from "../components/OrdersPageLayout";

export default function TableOrderDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; tableId: string }>;
}) {
  const { storeId, tableId } = use(params);

  return (
    <OrdersPageLayout>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <Suspense fallback={<LoadingSpinner />}>
          <TableOrderDetail params={{ storeId, tableId }} />
        </Suspense>
      </ErrorBoundary>
    </OrdersPageLayout>
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
