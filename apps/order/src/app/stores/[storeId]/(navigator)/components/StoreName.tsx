import useQueryWithSession from "@spaceorder/api/hooks/useQueryWithSession";
import { StoreContext } from "@spaceorder/db/types";

export default function StoreName() {
  const { data: storeName } = useQueryWithSession<StoreContext, string>(
    "/stores/v1/sessions/me/store-context",
    {
      queryOptions: {
        select: (storeContext) => storeContext.table.store.name,
      },
    }
  );

  return <h1 className="md:text-lg font-bold truncate">{storeName}</h1>;
}
