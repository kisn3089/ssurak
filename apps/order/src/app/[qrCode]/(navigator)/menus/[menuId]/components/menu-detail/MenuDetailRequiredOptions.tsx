"use client";

import Options from "../options/Options";
import { useMenuDetailContext } from "./MenuDetailContext";

export function MenuDetailRequiredOptions() {
  const {
    state: { selectedOptions },
    actions: { selectRequiredOption },
    meta: { requiredOptions },
  } = useMenuDetailContext();

  return (
    <Options
      options={requiredOptions}
      selectedOptions={selectedOptions.required}
      changeOption={selectRequiredOption}
    />
  );
}
