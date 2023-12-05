import { useCallback, useRef } from "react";

export function useStickyValue<T>(value: T): { value: T; reset: () => void } {
  const ref = useRef<T>();
  if (value !== undefined) ref.current = value;
  const reset = useCallback(() => {
    ref.current = undefined;
  }, []);
  return { value: ref.current as T, reset };
}
