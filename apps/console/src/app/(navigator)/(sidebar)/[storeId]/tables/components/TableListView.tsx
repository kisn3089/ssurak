"use client";

import { Table } from "@ssurak/api/types/table/table.interface";
import { Badge } from "@ssurak/ui/components/forms/badge";
import TableActionsProvider, {
  tableActionToastId,
} from "./TableActionsProvider";
import TableInfoRow from "./TableInfoRow";
import Link from "next/link";
import TableActions from "./TableActions";
import { useSonner } from "@ssurak/ui/components/sonner";

const activeBadge = {
  active: <Badge className="text-xs bg-green-100 text-teal-deep">활성화</Badge>,
  inactive: (
    <Badge className="text-xs bg-gray-100 text-gray-500">비활성화</Badge>
  ),
};

interface TableListViewProps {
  tableList: Table[];
}

export default function TableListView({ tableList }: TableListViewProps) {
  const { toasts } = useSonner();

  return (
    <TableActionsProvider>
      {tableList.map((table) => {
        const metaOptionalInfo = [table.seats, table.section, table.floor];
        const isActioning = toasts.some(
          (activeToast) =>
            activeToast.type === "loading" &&
            (activeToast.id === tableActionToastId.activate(table.publicId) ||
              activeToast.id === tableActionToastId.delete(table.publicId))
        );

        return (
          <tr
            className={`font-semibold text-sm border-b last:border-b-0 ${isActioning ? "opacity-50 pointer-events-none" : ""}`}
            aria-disabled={isActioning}
            key={table.publicId}
          >
            <TableInfoRow>
              <Link
                className="underline underline-offset-1 cursor-pointer"
                href={`tables/${table.publicId}`}
              >
                {table.tableNumber}
              </Link>
            </TableInfoRow>
            {metaOptionalInfo.map((info, index) => (
              <TableInfoRow key={index}>{info ?? ""}</TableInfoRow>
            ))}
            <TableInfoRow overflowVisible>
              {activeBadge[table.isActive ? "active" : "inactive"]}
            </TableInfoRow>
            <TableInfoRow className="text-right">
              <TableActions tableForAction={table} />
            </TableInfoRow>
          </tr>
        );
      })}
    </TableActionsProvider>
  );
}
