import { TableBody, TableCell, TableRow } from "@ssurak/ui/components/table";
import { useOrderDetailContext } from "../OrderDetailContext";
import ActivityRender from "@ssurak/ui/components/activity-render/ActivityRender";
import LoadingSpinner from "@/app/(navigator)/components/LoadingSpinner";
import { tableOrderColumns } from "../../tableOrderColumns";

interface OrderTableBodyProps {
  children: React.ReactNode;
}

export function OrderTableBody({ children }: OrderTableBodyProps) {
  const {
    meta: { isRefetching },
  } = useOrderDetailContext();

  return (
    <TableBody>
      <ActivityRender value={!isRefetching} fallback={<LoadingFallback />}>
        {() => children}
      </ActivityRender>
    </TableBody>
  );
}

function LoadingFallback() {
  return (
    <TableRow>
      <TableCell colSpan={tableOrderColumns.length}>
        <LoadingSpinner />
      </TableCell>
    </TableRow>
  );
}
