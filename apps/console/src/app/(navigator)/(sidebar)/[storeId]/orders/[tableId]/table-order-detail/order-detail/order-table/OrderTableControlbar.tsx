import ActivityRender from "@ssurak/ui/components/activity-render/ActivityRender";
import { Button } from "@ssurak/ui/components/buttons/button";
import { TableCell } from "@ssurak/ui/components/table";
import { tableOrderColumns } from "../../tableOrderColumns";
import { useOrderDetailContext } from "../OrderDetailContext";
import { OrderItemWithOrder } from "../OrderDetailTable";
import { Row } from "@tanstack/react-table";
import RequestButton from "@ssurak/ui/components/buttons/RequestButton";

interface OrderTableControlbarProps {
  row: Row<OrderItemWithOrder>;
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

  async function stopEventAndRunFn(
    e: React.MouseEvent<HTMLButtonElement>,
    fn: () => Promise<void>
  ) {
    e.stopPropagation();
    await fn();
  }

  const fontSemiBold = "font-semibold";
  return (
    <ActivityRender value={isSelected}>
      {() => (
        <TableCell colSpan={tableOrderColumns.length} className="p-0">
          <div className="w-full grid grid-cols-[1fr_2fr_3fr] gap-2 p-2">
            <Button
              className={fontSemiBold}
              variant={"destructive"}
              onClick={(e) => stopEventAndRunFn(e, removeOrderItem)}
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
              onClick={(e) => stopEventAndRunFn(e, updateOrderItem)}
            >
              변경
            </RequestButton>
          </div>
        </TableCell>
      )}
    </ActivityRender>
  );
}
