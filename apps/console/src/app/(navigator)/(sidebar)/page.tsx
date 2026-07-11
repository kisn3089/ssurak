import StoreEntryRedirect from "./components/StoreEntryRedirect";

/**
 * 콘솔 루트 진입점.
 * 매장 리졸빙은 StoreEntryRedirect(서버)로 위임해 마지막 접속 매장의 `/{storeId}/orders`로 리다이렉트한다.
 */
export default function ConsoleEntryPage() {
  return <StoreEntryRedirect />;
}
