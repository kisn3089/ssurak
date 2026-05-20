import { MenuOptionEntry } from "@spaceorder/db/types";

export function isTrigger<Option extends string>(
  optionInfo: MenuOptionEntry<"custom">["optionInfo"],
  selectedOptions: Map<string, Option>
): boolean {
  if (
    optionInfo.trigger === null ||
    optionInfo.trigger === undefined ||
    optionInfo.trigger.length === 0
  ) {
    return true;
  }

  return optionInfo.trigger.some((trigger) => {
    const selectedOption = selectedOptions.get(trigger.group);
    return trigger.in.includes(selectedOption || "");
  });
}

export function deleteNotTriggeredOptions<Option extends string>(
  options: MenuOptionEntry[],
  target: Map<string, Option>,
  compareWith: Map<string, Option>
): Map<string, Option> {
  const selectedOptionsMap = new Map(target);

  options.forEach((option) => {
    if (!isTrigger(option.optionInfo, compareWith)) {
      selectedOptionsMap.delete(option.key);
    }
  });

  return selectedOptionsMap;
}
