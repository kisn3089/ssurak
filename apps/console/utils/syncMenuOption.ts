import { CreateOrderByTablePayload } from "@spaceorder/api/core";
import { MenuCustomOption, MenuRequiredOption } from "@spaceorder/db/types";

export function syncOptions<
  MenuOption extends {
    requiredOptions: MenuRequiredOption | null;
    customOptions: MenuCustomOption | null;
  } & Partial<
    Pick<CreateOrderByTablePayload["orderItems"][number], "quantity">
  >,
>(
  findMemoizedMenu: MenuOption,
  menu: CreateOrderByTablePayload["orderItems"][number]
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
