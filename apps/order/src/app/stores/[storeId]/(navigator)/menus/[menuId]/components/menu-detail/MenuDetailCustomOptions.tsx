"use client";

import Options from "../options/Options";
import { useMenuDetailContext } from "./MenuDetailContext";

export function MenuDetailCustomOptions() {
  const {
    actions: { selectCustomOption },
    meta: { customOptions, allSelectedOptions },
  } = useMenuDetailContext();

  return (
    <Options
      options={customOptions}
      selectedOptions={allSelectedOptions}
      changeOption={selectCustomOption}
    />
  );
}
