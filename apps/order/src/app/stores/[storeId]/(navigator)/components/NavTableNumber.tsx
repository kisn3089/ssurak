import { Separator } from "@spaceorder/ui/components/forms/separator";
import TableNumber from "./TableNumber";
import CartLink from "./CartLink";

export default function NavTableNumber() {
  return (
    <div className="flex items-center gap-4 h-full py-3">
      <TableNumber />
      <Separator orientation="vertical" />
      <CartLink />
    </div>
  );
}
