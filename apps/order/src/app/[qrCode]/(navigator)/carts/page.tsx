import CartOrderItems from "./components/CartOrderItems";
import CartPayment from "./components/CartPayment";

export default function CartPage() {
  return (
    <div className="bg-accent flex flex-col gap-y-2">
      <CartOrderItems />
      <CartPayment />
    </div>
  );
}
