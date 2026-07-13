import { CartItem } from "@ssurak/api/types/cart/cart.interface";

type CartMenuOptionsProps = {
  required: CartItem["requiredOptions"];
  custom: CartItem["customOptions"];
};
export default function CartMenuOptions({
  required,
  custom,
}: CartMenuOptionsProps) {
  const options = Object.entries(Object.assign({}, required, custom));

  return (
    <div className="pt-2">
      {options.map(([key, value]) => (
        <div key={key} className="flex gap-x-2 text-sm">
          <p className="font-semibold text-black">{key}</p>
          <p className="text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
