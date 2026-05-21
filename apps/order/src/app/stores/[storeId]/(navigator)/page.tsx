import { use } from "react";
import MoveMenusPageButton from "../components/MoveMenusPageButton";
import OrderHistory from "../components/order-history/OrderHistory";

export default function StorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId: _ } = use(params);

  return (
    <div className="p-4">
      <section>
        <h2 className="font-bold text-lg">{"주문 내역"}</h2>
        <OrderHistory />
      </section>
      <section className="flex items-center py-4">
        <MoveMenusPageButton />
      </section>
    </div>
  );
}
