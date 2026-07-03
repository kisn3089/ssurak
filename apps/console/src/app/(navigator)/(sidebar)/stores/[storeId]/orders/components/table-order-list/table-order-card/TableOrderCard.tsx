"use client";

import { Card } from "@spaceorder/ui/components/layouts/card";
import ConditionalLink from "@/components/ConditionalLink";
import { useParams } from "next/navigation";
import { BoardTableWithSession } from "@spaceorder/db/types";

interface TableOrderCardProps {
  children: React.ReactNode;
  sanitizedTable: BoardTableWithSession;
}

export function TableOrderCard({
  children,
  sanitizedTable,
}: TableOrderCardProps) {
  const { storeId, tableId } = useParams<{
    storeId: string;
    tableId: string;
  }>();
  const isActivatedTable = sanitizedTable.isActive === true;
  const isSelected = tableId === sanitizedTable.publicId;

  const inactiveStyle = !isActivatedTable
    ? "opacity-20 cursor-not-allowed"
    : "hover:shadow-md hover:shadow-destructive/50";
  const selectedStyle = isSelected
    ? "shadow-lg hover:shadow-lg shadow-destructive/50"
    : "";

  return (
    <ConditionalLink
      condition={isActivatedTable && !isSelected}
      href={`/stores/${storeId}/orders/${sanitizedTable.publicId}`}
      className="rounded-lg"
    >
      <Card
        className={`cursor-pointer rounded-2xl h-full min-h-[220px] flex flex-col transition-shadow duration-300 bg-accent ${inactiveStyle} ${selectedStyle}`}
      >
        {children}
      </Card>
    </ConditionalLink>
  );
}
