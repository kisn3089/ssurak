"use client";

import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";
import { OrderBoardByStore } from "@spaceorder/db";

export default function AwaitFetch({
  url,
  children,
  onSuccess,
}: {
  url: string;
  children: React.ReactNode;
  onSuccess?: (data: OrderBoardByStore) => void;
}) {
  const { isSuccess } = useSuspenseWithAuth<OrderBoardByStore>(url, {
    onSuccess,
  });

  if (!isSuccess) {
    return null;
  }

  return <>{children}</>;
}
