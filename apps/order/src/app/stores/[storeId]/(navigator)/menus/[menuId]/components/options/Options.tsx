"use client";

import type { MenuOptionEntry } from "@spaceorder/db/types";
import OptionItem from "./OptionItem";

type OptionsProps = {
  options: MenuOptionEntry[];
  selectedOptions: Map<string, string>;
  changeOption: (optionGroupKey: string, optionKey: string) => void;
};

export default function Options({
  options,
  selectedOptions,
  changeOption,
}: OptionsProps) {
  return (
    <>
      {options.map((option) => (
        <OptionItem
          key={option.key}
          option={option}
          selectedOptions={selectedOptions}
          changeOption={changeOption}
        />
      ))}
    </>
  );
}
