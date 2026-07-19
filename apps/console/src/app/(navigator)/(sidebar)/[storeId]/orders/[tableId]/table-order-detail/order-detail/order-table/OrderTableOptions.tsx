import { OptionSnapshotValue } from "@ssurak/api/types/menu/menuOptions.interface";
import { TableCell } from "@ssurak/ui/components/table";
import { OrderItemWithOrder } from "../OrderDetailTable";
import OptionTags from "@ssurak/ui/components/menu/options/OptionTags";

interface OrderTableOptionsProps {
  optionsSnapshot: OrderItemWithOrder["optionsSnapshot"];
}
export function OrderTableOptions({ optionsSnapshot }: OrderTableOptionsProps) {
  if (!optionsSnapshot) return null;

  return (
    <TableCell className="flex gap-1 flex-wrap pt-4 px-4 pb-0">
      <OptionTags
        options={snapshotToOptionTags(optionsSnapshot.requiredOptions)}
        variant="destructive"
      />
      <OptionTags
        options={snapshotToOptionTags(optionsSnapshot.customOptions)}
        variant="secondary"
      />
    </TableCell>
  );
}

function snapshotToOptionTags(
  options: OptionSnapshotValue | undefined
): Record<string, string> | undefined {
  if (!options) return undefined;
  const result: Record<string, string> = {};
  Object.entries(options).forEach(([key, value]) => {
    result[key] =
      `${value.key}${value.price !== 0 ? ` +${value.price.toLocaleString("ko-KR")}` : ""}`;
  });
  return result;
}
