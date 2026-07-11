"use client";

import { useStoreOrderSyncDaemon } from "@/lib/realtime/useStoreOrderSyncDaemon";
import { OrderSyncEvent } from "@spaceorder/db/types";
import { toastByLevel } from "@spaceorder/ui/components/sonner";
import { useParams } from "next/navigation";

/**
 * Notice와 Orders InvalidateQuery를 온전히 분리하기 위해서는 서버에서 event 명을 세분화해야 합니다.
 * @example "notice:stores:${storeId}"
 * @see order-events.service.ts
 *
 * URL 모델(`/{storeId}/...`)에서 매장 페이지의 storeId는 항상 존재하므로 useParams로 조회한다.
 */
export default function OrderNoticeDaemon() {
  const { storeId } = useParams<{ storeId: string }>();

  const triggerNotice = ({ notice }: OrderSyncEvent) => {
    const { level, message } = notice || {};
    if (level && message?.owner)
      toastByLevel(level, message.owner, {
        duration: Infinity,
        closeButton: true,
      });
  };

  useStoreOrderSyncDaemon(storeId, {
    onCreatedAction: triggerNotice,
    onUpdatedAction: triggerNotice,
    onCancelledAction: triggerNotice,
  });

  return null;
}
