import { CreateOrderPayload } from "@ssurak/api/schemas/model/order.schema";
import {
  MenuCustomOption,
  MenuRequiredOption,
} from "@ssurak/api/types/menu/menuOptions.interface";

export function syncOptions<
  MenuOption extends {
    requiredOptions: MenuRequiredOption | null;
    customOptions: MenuCustomOption | null;
  } & Partial<Pick<CreateOrderPayload["orderItems"][number], "quantity">>,
>(
  findMemoizedMenu: MenuOption,
  menu: CreateOrderPayload["orderItems"][number]
): MenuOption {
  const { requiredOptions, customOptions } = menu;
  const copiedMemoizedMenu = structuredClone(findMemoizedMenu);

  applyDefaultKeys(copiedMemoizedMenu.requiredOptions, requiredOptions);
  applyDefaultKeys(copiedMemoizedMenu.customOptions, customOptions);
  if (menu.quantity !== undefined) {
    copiedMemoizedMenu.quantity = menu.quantity;
  }
  return copiedMemoizedMenu;
}

function applyDefaultKeys(
  memoizedOptions: MenuRequiredOption | MenuCustomOption | null,
  selectedOptions?: Record<string, string>
) {
  if (!memoizedOptions || !selectedOptions) return;

  for (const [group, optionKey] of Object.entries(selectedOptions)) {
    const memoizedOption = memoizedOptions[group];
    if (memoizedOption) {
      memoizedOption.defaultKey = optionKey;
    }
  }
}
