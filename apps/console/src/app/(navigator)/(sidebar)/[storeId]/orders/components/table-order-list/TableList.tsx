"use client";

import { ActiveSessionResponse, BoardTableWithSession } from "@spaceorder/db";
import { TableOrder } from "./table-order";
import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";
import { BoardTable } from "@spaceorder/ui/components/board-table";
import SheetQrCode from "../SheetQrCode";
import { useParams, usePathname } from "next/dist/client/components/navigation";
import ConditionalLink from "@/app/(navigator)/components/ConditionalLink";
import QrButton from "@spaceorder/ui/components/qr-scan/QrButton";

type TableListProps = {
  sanitizedTable: BoardTableWithSession;
};

export default function TableList({ sanitizedTable }: TableListProps) {
  const { data: session } = useSuspenseWithAuth<ActiveSessionResponse>(
    `/orders/v1/tables/${sanitizedTable.publicId}/active-session`
  );
  const { tableId } = useParams<{ tableId: string }>();
  const [pathname] = usePathname().split("orders");

  const isActivatedTable = sanitizedTable.isActive === true;
  const isSelected = tableId === sanitizedTable.publicId;

  const inactiveStyle = !isActivatedTable
    ? "opacity-20 cursor-not-allowed"
    : "hover:shadow-md hover:shadow-destructive/50";
  const selectedStyle = isSelected
    ? "shadow-lg hover:shadow-lg shadow-destructive/50"
    : "";

  const orders = session?.orders ?? [];

  return (
    <ConditionalLink
      condition={isActivatedTable && !isSelected}
      href={`${pathname}orders/${sanitizedTable.publicId}`}
      className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <BoardTable.Provider table={sanitizedTable}>
        <BoardTable.Layout className={`${inactiveStyle} ${selectedStyle}`}>
          <BoardTable.Header>
            <BoardTable.LeftLayout>
              <SheetQrCode
                tableNumber={sanitizedTable.tableNumber}
                qrCode={sanitizedTable.qrCode}
              >
                <QrButton disabled={!sanitizedTable.isActive} />
              </SheetQrCode>
              <BoardTable.Title />
              <BoardTable.Section />
            </BoardTable.LeftLayout>
            <BoardTable.RightLayout>
              <BoardTable.MetaInfo />
            </BoardTable.RightLayout>
          </BoardTable.Header>
          <BoardTable.Content>
            <TableOrder.AcceptAllButton
              orders={orders}
              tableId={sanitizedTable.publicId}
            />
            <TableOrder.OrderList
              orders={orders}
              tableId={sanitizedTable.publicId}
            />
          </BoardTable.Content>
          <BoardTable.Footer />
        </BoardTable.Layout>
      </BoardTable.Provider>
    </ConditionalLink>
  );
}
