import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";
import { useMenuDetailContext } from "@spaceorder/ui/components/menu/menu-detail/MenuDetailContext";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";
import { useCreateOrderContext } from "../CreateOrderProvider";

export default function AddMenuButton() {
  const {
    state: { menu },
    meta: { price },
    actions: { snapshotToFetch },
  } = useMenuDetailContext();

  const {
    state: { editingMenu },
    actions: { selectMenuClear, addMenu, updateMenu },
  } = useCreateOrderContext();

  const isEditing = editingMenu !== null;

  const addMenuToOrder = () => {
    const menuSnapshot = snapshotToFetch();
    if (menuSnapshot) {
      if (editingMenu) {
        updateMenu(menuSnapshot, menu, editingMenu);
      } else {
        addMenu(menuSnapshot, menu);
      }
      selectMenuClear();
    }
  };

  return (
    <div className="p-2 w-full grid grid-cols-[1fr_3fr] gap-x-2 border-t border-border">
      <TouchEventButton
        onClick={selectMenuClear}
        variant={"secondary"}
        className="h-12 font-bold tracking-wide rounded-2xl"
      >
        닫기
      </TouchEventButton>
      <TouchEventButton
        className="h-12 font-bold tracking-wide rounded-2xl"
        onClick={addMenuToOrder}
      >
        {`${transCurrencyFormat(price)}원 - ${isEditing ? "변경" : "추가"}`}
      </TouchEventButton>
    </div>
  );
}
