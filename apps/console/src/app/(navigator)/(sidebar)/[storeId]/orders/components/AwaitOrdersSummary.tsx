"use client";

import AwaitFetch from "@/app/(navigator)/components/AwaitFetch";
import { useSetCacheByStoreBoard } from "../hooks/useSetCacheByStoreBoard";
import { useParams } from "next/navigation";

export default function AwaitOrdersSummary({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ storeId: string }>();
  const { setCache } = useSetCacheByStoreBoard();
  return (
    <AwaitFetch
      url={`/orders/v1/stores/${params.storeId}/board`}
      onSuccess={setCache}
    >
      {children}
    </AwaitFetch>
  );
}
