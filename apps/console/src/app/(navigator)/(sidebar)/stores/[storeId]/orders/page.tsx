import React from "react";
import EmptyOrderDetail from "./[tableId]/table-order-detail/EmptyOrderDetail";

export default function OrdersPage() {
  return (
    // TableOrderDetailPage와 동일하게 스타일을 맞춰야 한다.
    <div className="overflow-hidden rounded-md border h-full flex flex-col justify-between shadow-sm w-xl min-w-xs">
      <EmptyOrderDetail />
    </div>
  );
}
