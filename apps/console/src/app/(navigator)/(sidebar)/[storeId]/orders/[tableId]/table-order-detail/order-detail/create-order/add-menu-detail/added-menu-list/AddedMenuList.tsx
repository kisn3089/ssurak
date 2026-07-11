import { useCreateOrderContext } from "../../CreateOrderProvider";
import AddedMenu from "./AddedMenu";

export default function AddedMenuList() {
  const {
    state: { addedMenus },
  } = useCreateOrderContext();

  return (
    <div className="flex flex-col gap-y-2 p-2">
      {Array.from(addedMenus.entries()).map(([fingerprint, entry]) => (
        <AddedMenu key={fingerprint} entry={entry} />
      ))}
    </div>
  );
}
