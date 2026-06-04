"use client";

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@spaceorder/ui/components/card";
import ActivityRender from "@spaceorder/ui/components/activity-render/ActivityRender";
import { useTableOrderContext } from "./TableOrderContext";
import TableOrderQrCode from "./TableOrderQrCode";

export function TableOrderHeader() {
  const {
    state: { summarizedTable, isActivatedTable },
  } = useTableOrderContext();

  const { tableNumber, qrCode, section } = summarizedTable;

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
      <ActivityRender mode={section ? "visible" : "hidden"}>
        <CardDescription className="text-sm">{section}</CardDescription>
      </ActivityRender>
    </CardHeader>
  );
}
