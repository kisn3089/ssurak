import { Badge } from "@ssurak/ui/components/forms/badge";
import { BADGE_BY_ORDER_STATUS } from "@ssurak/ui/constants/badgeByOrderStatus.const";

type TableOrderStatusBadgeProps = {
  orderStatus: keyof typeof BADGE_BY_ORDER_STATUS;
  isLoading: boolean;
  updateNextStatus?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function TableOrderStatusBadge({
  orderStatus,
  isLoading,
  updateNextStatus,
}: TableOrderStatusBadgeProps) {
  const isFinishStatus =
    orderStatus === "COMPLETED" || orderStatus === "CANCELLED";

  const disabled = isLoading || isFinishStatus;

  return (
    <div className="flex justify-center cursor-pointer">
      <button
        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="button"
        onClick={updateNextStatus}
        disabled={disabled}
      >
        <Badge
          variant={BADGE_BY_ORDER_STATUS[orderStatus].badgeVariant}
          className="w-fit text-xs cursor-pointer"
          isLoading={isLoading}
        >
          {BADGE_BY_ORDER_STATUS[orderStatus].label}
        </Badge>
      </button>
    </div>
  );
}
