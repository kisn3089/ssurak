import type { Metadata } from "next";
import { OrderBoardByStore } from "@spaceorder/db";
import TableBoard from "./components/table-board/TableBoard";
import AwaitOrdersSummary from "./components/AwaitOrdersSummary";
import GridLayout from "./components/GridLayout";
import OrderSyncDaemon from "./components/OrderSyncDaemon";
import ServerPrefetch from "@/components/ServerPrefetch";
import { setTablesCache } from "./utils/setTablesCache";

export const metadata: Metadata = {
  title: "주문 관리",
  description: "주문 목록을 확인하고 관리하세요.",
};

export default async function OrdersLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}>) {
  const { storeId } = await params;

  return (
    <GridLayout>
      <ServerPrefetch<OrderBoardByStore>
        url={`/orders/v1/stores/${storeId}/board`}
        shouldSuccess
        onSuccess={(data, queryClient) =>
          setTablesCache(data, queryClient, storeId)
        }
      >
        <AwaitOrdersSummary>
          <OrderSyncDaemon />
          <TableBoard />
          {children}
        </AwaitOrdersSummary>
      </ServerPrefetch>
    </GridLayout>
  );
}
