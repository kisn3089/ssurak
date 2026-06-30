import { Button } from "@spaceorder/ui/components/buttons/button";
import { X } from "lucide-react";
import { useCart } from "./CartProvider";

export default function DeleteMenuButton({ menuId }: { menuId: string }) {
  const { actions } = useCart();

  return (
    <Button
      variant="ghost"
      className="py-1 px-2 size-2 h-fit hover:bg-transparent"
      onClick={() => actions.removeMenu(menuId)}
    >
      <X className="cursor-pointer shrink-0 size-5" />
    </Button>
  );
}
