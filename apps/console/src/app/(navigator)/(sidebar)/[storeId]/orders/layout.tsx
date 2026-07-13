import type { Metadata } from "next";
import { OrderBoardByStoreResponse } from "@ssurak/api/types/board/board.interface";
import TableBoard from "./components/table-board/TableBoard";
import AwaitOrdersSummary from "./components/AwaitOrdersSummary";
import GridLayout from "./components/GridLayout";
import OrderSyncDaemon from "./components/OrderSyncDaemon";
import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import { setTablesCache } from "./utils/setTablesCache";
import RealtimeStatusBanner from "@/app/(navigator)/(sidebar)/components/realtime/RealtimeStatusBanner";

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
    <>
      <RealtimeStatusBanner />
      <GridLayout>
        <ServerPrefetch<OrderBoardByStoreResponse>
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
    </>
  );
}
