import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import { Button } from "@spaceorder/ui/components/button";
import { TableCell } from "@spaceorder/ui/components/table";
import { tableOrderColumns } from "../../tableOrderColumns";
import { useOrderDetailContext } from "../OrderDetailContext";
import { OrderItemWithSummarizedOrder } from "../OrderDetailTable";
import { Row } from "@tanstack/react-table";
import RequestButton from "@spaceorder/ui/components/RequestButton";

interface OrderTableControlbarProps {
  row: Row<OrderItemWithSummarizedOrder>;
  isSelected: boolean;
}
export function OrderTableControlbar({
  row,
  isSelected,
}: OrderTableControlbarProps) {
  const {
    state: { editingItem, updateMutation, removeMutation },
    actions: { updateOrderItem, removeOrderItem },
  } = useOrderDetailContext();

  const preventAndUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderItem();
  };

  const preventAndRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeOrderItem();
  };

  const fontSemiBold = "font-semibold";
  return (
    <ActivityRender mode={isSelected ? "visible" : "hidden"}>
      <TableCell colSpan={tableOrderColumns.length} className="p-0">
        <div className="w-full grid grid-cols-[1fr_2fr_3fr] gap-2 p-2">
          <Button
            className={fontSemiBold}
            variant={"destructive"}
            onClick={preventAndRemove}
            isLoading={removeMutation.isPending}
          >
            삭제
          </Button>
          <Button className={fontSemiBold} variant={"outline"} disabled>
            메뉴 변경
          </Button>
          <RequestButton
            mutate={updateMutation}
            message={{
              disabled: "수량을 변경해 주세요",
              loading: "수량 변경 중...",
              error: "다시 시도",
            }}
            disabled={editingItem?.quantity === row.original.quantity}
            className={fontSemiBold}
            onClick={preventAndUpdate}
          >
            변경
          </RequestButton>
        </div>
      </TableCell>
    </ActivityRender>
  );
}
