import { useState } from "react";

export function useCheckUnitPrefix() {
  const [unitCode, setUnitCode] = useState(window._env_?.CHECK_SHOW_MENU || false);

  return unitCode;
}
