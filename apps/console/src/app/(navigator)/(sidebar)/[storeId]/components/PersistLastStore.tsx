"use client";

import { COOKIE_TABLE } from "@ssurak/api/utils/cookieTable.const";
import { useEffect } from "react";

type PersistLastStoreProps = {
  storeId: string;
};

/**
 * 현재 보고 있는 매장을 마지막 접속 매장 쿠키에 기록한다.
 * 공유 URL로 직접 진입하는 경우에도 쿠키가 갱신되어, 다음 진입 시 해당 매장으로 리다이렉트된다.
 * httpOnly가 아닌 쿠키이므로 클라이언트에서 직접 기록한다.
 */
export default function PersistLastStore({ storeId }: PersistLastStoreProps) {
  useEffect(() => {
    document.cookie = `${COOKIE_TABLE.LAST_ACCESSED_STORE_ID}=${storeId}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [storeId]);

  return null;
}
