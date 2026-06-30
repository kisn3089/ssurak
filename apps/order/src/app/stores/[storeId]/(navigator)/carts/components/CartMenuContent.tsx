import { CardContent, CardTitle } from "@spaceorder/ui/components/layouts/card";
import CartMenuOptions from "./CartMenuOptions";
import { PublicCartItem } from "@spaceorder/db/types";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";

export default function CartMenuContent({ menu }: { menu: PublicCartItem }) {
  return (
    <div className="flex flex-col">
      <CardTitle className="text-lg flex-1">{menu.menuName}</CardTitle>
      <CardContent className="p-0 font-semibold">
        {transCurrencyFormat(menu.unitPrice)}
      </CardContent>
      <CartMenuOptions
        required={menu.requiredOptions}
        custom={menu.customOptions}
      />
    </div>
  );
}
