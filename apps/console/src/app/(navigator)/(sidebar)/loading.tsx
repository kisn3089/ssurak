"use client";

import { Skeleton } from "@spaceorder/ui/components/skeleton";
import TableBoardLayout from "./[storeId]/orders/components/table-board/TableOrderListLayout";
import GridLayout from "./[storeId]/orders/components/GridLayout";

export default function LoadingSkeleton() {
  return (
    <GridLayout>
      <TableBoardLayout>
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} />
        ))}
      </TableBoardLayout>
      <div />
    </GridLayout>
  );
}
