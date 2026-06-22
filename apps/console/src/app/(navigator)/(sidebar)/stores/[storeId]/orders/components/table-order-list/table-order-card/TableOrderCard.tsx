"use client";

import { Card } from "@spaceorder/ui/components/card";
import ConditionalLink from "@/components/ConditionalLink";
import { useParams } from "next/navigation";
import { BoardTableWithSessions } from "@spaceorder/db/types";

interface TableOrderCardProps {
  children: React.ReactNode;
  sanitizedTable: BoardTableWithSessions;
}

export function TableOrderCard({
  children,
  sanitizedTable,
}: TableOrderCardProps) {
  const { storeId, tableId } = useParams<{
    storeId: string;
    tableId: string;
  }>();
  const session = sanitizedTable.tableSessions?.[0] ?? null;
  const isActivatedTable = sanitizedTable.isActive === true;
  const isSelected = tableId === sanitizedTable.publicId;

  const inactiveStyle = !isActivatedTable
    ? "opacity-20 cursor-not-allowed"
    : "";
  const sessionActiveStyle = session ? "hover:bg-accent" : "";
  const selectedStyle = isSelected ? "shadow-lg shadow-destructive/50" : "";

  return (
    <ConditionalLink
      condition={isActivatedTable}
      href={`/stores/${storeId}/orders/${sanitizedTable.publicId}`}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      <Card
        className={`h-full min-h-[220px] flex flex-col transition-shadow duration-300 bg-accent ${sessionActiveStyle} ${inactiveStyle} ${selectedStyle}`}
      >
        {children}
      </Card>
    </ConditionalLink>
  );
}
