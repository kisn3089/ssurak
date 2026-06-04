import React from "react";
import EmptyOrderDetail from "./[tableId]/table-order-detail/EmptyOrderDetail";
import OrdersPageLayout from "./components/OrdersPageLayout";

export default function OrdersPage() {
  return (
    <OrdersPageLayout>
      <EmptyOrderDetail />
    </OrdersPageLayout>
  );
}
