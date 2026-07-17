import { CardFooter } from "@ssurak/ui/components/layouts/card";
import QrButton from "@ssurak/ui/components/qr-scan/QrButton";
import { BoardTable } from "@ssurak/ui/components/board-table";
import { TableOrder } from "../../../orders/components/table-order-list/table-order";

type Table = {
  tableNumber: string;
  seats?: number | null;
  section?: string | null;
  floor?: number | null;
  disabled?: boolean;
};
type SampleTableProps = {
  table: Table;
  children?: React.ReactNode;
  isSuccess?: boolean;
};

export default function SampleTable({
  table,
  children,
  isSuccess,
}: SampleTableProps) {
  return (
    <BoardTable.Provider table={table}>
      <BoardTable.Layout
        className={`pointer-events-none overflow-hidden ${table.disabled ? "opacity-50" : "opacity-100"} ${isSuccess ? "animate-tzCard border-[#c3ecd1] bg-[#f1faf4] mb-3" : ""}`}
      >
        <BoardTable.Header
          className={isSuccess ? "border-[#c3ecd1] bg-green-50" : ""}
        >
          <BoardTable.LeftLayout>
            <div className="pointer-events-none">
              <QrButton isSuccess={isSuccess} />
            </div>
            <BoardTable.Title />
            <BoardTable.Section />
          </BoardTable.LeftLayout>
          <BoardTable.RightLayout>
            {!isSuccess && <BoardTable.MetaInfo />}
            <BoardTable.SuccessBadge isSuccess={isSuccess} />
          </BoardTable.RightLayout>
        </BoardTable.Header>
        <BoardTable.Content
          className={`min-h-52 ${isSuccess ? "border-[#d6ecdd] flex" : ""}`}
        >
          {children}
          {!isSuccess && (
            <div className="flex flex-col gap-y-1 p-2">
              <TableOrder.ItemLayout>
                <TableOrder.StatusBadge
                  orderStatus={"PENDING"}
                  isLoading={false}
                />
                <TableOrder.MenuInfo menuName={"아메리카노"} quantity={2} />
                <TableOrder.MenuInfo menuName={"카페 라떼"} quantity={4} />
              </TableOrder.ItemLayout>
            </div>
          )}
        </BoardTable.Content>
        <CardFooter className="p-2 min-h-9"></CardFooter>
      </BoardTable.Layout>
    </BoardTable.Provider>
  );
}
