"use client";

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@spaceorder/ui/components/layouts/card";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import TableOrderQrCode from "./TableOrderQrCode";
import { BoardTableWithSession } from "@spaceorder/db/types";

type TableOrderHeaderProps = {
  sanitizedTable: BoardTableWithSession;
};

export function TableOrderHeader({ sanitizedTable }: TableOrderHeaderProps) {
  const { isActive, tableNumber, qrCode, section } = sanitizedTable;
  const isActivatedTable = isActive === true;

  return (
    <CardHeader className="space-y-0 flex flex-row justify-between items-center gap-1 p-2">
      <div className="flex items-center gap-x-2">
        <TableOrderQrCode
          tableNumber={tableNumber}
          qrCode={qrCode}
          disabled={!isActivatedTable}
        />
        <CardTitle>{tableNumber}</CardTitle>
      </div>
      <ActivityRender value={section}>
        {(section) => (
          <CardDescription className="text-sm">{section}</CardDescription>
        )}
      </ActivityRender>
    </CardHeader>
  );
}
