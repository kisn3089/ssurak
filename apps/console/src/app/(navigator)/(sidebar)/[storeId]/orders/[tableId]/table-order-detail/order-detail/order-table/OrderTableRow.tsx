import { TableRow } from "@spaceorder/ui/components/table";
import { useOrderDetailContext } from "../OrderDetailContext";
import { OrderItemWithOrder } from "../OrderDetailTable";
import { Row } from "@tanstack/react-table";
import { OrderStatus } from "@spaceorder/db/index";

interface OrderTableRowProps {
  children: React.ReactNode;
  row: Row<OrderItemWithOrder>;
  isSelected: boolean;
}
export function OrderTableRow({
  children,
  row,
  isSelected,
}: OrderTableRowProps) {
  const {
    actions: { setEditingItem },
  } = useOrderDetailContext();

  const isFinalizedOrder =
    row.original.orderStatus === OrderStatus.COMPLETED ||
    row.original.orderStatus === OrderStatus.CANCELLED;

  const handleRowClick = (
    e:
      | React.MouseEvent<HTMLTableRowElement>
      | React.KeyboardEvent<HTMLTableRowElement>
  ) => {
    e.stopPropagation();

    if (isFinalizedOrder) return;

    // editingItem이 단일 선택의 SSOT. 설정 시 이전 선택은 자동으로 대체된다.
    setEditingItem(isSelected ? null : row.original);
  };

  const ignoreTabKey = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "Tab") {
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Space 키의 스크롤 방지
      handleRowClick(e);
    }
  };

  const disabled = `opacity-50 pointer-events-none`;

  return (
    <TableRow
      role="button"
      tabIndex={isSelected || isFinalizedOrder ? -1 : 0}
      onKeyDown={isSelected ? undefined : ignoreTabKey}
      onClick={handleRowClick}
      data-state={isSelected && "selected"}
      className={`flex flex-col ${isFinalizedOrder ? disabled : ""}`}
    >
      {children}
    </TableRow>
  );
}
