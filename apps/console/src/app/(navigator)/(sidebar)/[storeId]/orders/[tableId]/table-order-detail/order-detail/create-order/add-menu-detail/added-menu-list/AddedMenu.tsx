import { Tag, X } from "lucide-react";
import OptionTags from "../OptionTags";
import {
  AddedMenuEntry,
  useCreateOrderContext,
} from "../../CreateOrderProvider";
import TouchFeedback from "@spaceorder/ui/components/animate-ui/components/TouchFeedback";
import { syncOptions } from "@utils/syncMenuOption";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";
import { Button } from "@spaceorder/ui/components/buttons/button";

type AddedMenuProps = {
  entry: AddedMenuEntry;
};

export default function AddedMenu({ entry }: AddedMenuProps) {
  const { snapshot, menu: menuDef } = entry;
  const {
    actions: { deleteMenu, editMenu },
  } = useCreateOrderContext();

  const hasOptions =
    Object.keys(snapshot.requiredOptions ?? {}).length > 0 ||
    Object.keys(snapshot.customOptions ?? {}).length > 0;

  const deleteAddedMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteMenu(snapshot);
  };

  const editAddedMenu = () => {
    const updatedMenu = syncOptions(menuDef, snapshot);
    editMenu(updatedMenu, snapshot);
  };

  return (
    <TouchFeedback>
      {({ isTouched, mouseProps, touchProps }) => (
        <div
          onClick={editAddedMenu}
          className={`px-5 py-4 bg-background rounded-xl shadow-md border border-border cursor-pointer transition-transform ${isTouched ? "scale-95" : ""}`}
          {...mouseProps}
          {...touchProps}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">{snapshot.menuName}</p>
            <div className="flex gap-x-2 items-center">
              <p className="tabular-nums">{snapshot.quantity}개</p>
              <Button
                size={"icon-sm"}
                variant={"secondary"}
                className="border border-border"
                onClick={deleteAddedMenu}
              >
                <X width={14} />
              </Button>
            </div>
          </div>
          <div className="flex justify-between pt-1">
            {hasOptions ? (
              <div className="flex flex-wrap items-center gap-1">
                <Tag width={14} />
                <OptionTags
                  options={snapshot.requiredOptions}
                  variant="destructive"
                />
                <OptionTags
                  options={snapshot.customOptions}
                  variant="secondary"
                />
              </div>
            ) : (
              <div />
            )}
            <span className="tracking-wide font-semibold">
              {transCurrencyFormat(snapshot.price)}
            </span>
          </div>
        </div>
      )}
    </TouchFeedback>
  );
}
