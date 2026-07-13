"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { tableOrderColumns } from "../tableOrderColumns";
import { useOrderDetailContext } from "./OrderDetailContext";
import { OrderTable } from "./order-table";
import { OrderStatus } from "@ssurak/api/types/order/order.interface";
import { OrderItem } from "@ssurak/api/types/orderItem/orderItem.interface";

export type OrderItemWithOrder = OrderItem & {
  totalPrice: number;
  orderId: string;
  orderStatus: OrderStatus;
};
export function OrderDetailTable() {
  const {
    state: { orderItems, editingItem },
    actions: { updateEditingQuantity },
  } = useOrderDetailContext();

  const tableMeta = {
    editingData: editingItem,
    updateEditingQuantity,
  };

  const table = useReactTable({
    data: orderItems,
    columns: tableOrderColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.publicId,
    meta: tableMeta,
  });

  return (
    <OrderTable.Frame>
      <OrderTable.Header table={table} />
      <OrderTable.Body>
        {table.getRowModel().rows.map((row) => {
          const isSelected = editingItem?.publicId === row.original.publicId;

          return (
            <OrderTable.Row key={row.id} row={row} isSelected={isSelected}>
              <OrderTable.Options
                optionsSnapshot={row.original.optionsSnapshot}
              />
              <OrderTable.Item row={row} />
              <OrderTable.Controlbar row={row} isSelected={isSelected} />
            </OrderTable.Row>
          );
        })}
      </OrderTable.Body>
    </OrderTable.Frame>
  );
}
