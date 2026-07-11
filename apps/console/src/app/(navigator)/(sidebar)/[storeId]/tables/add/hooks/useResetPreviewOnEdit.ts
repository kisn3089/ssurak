import { useEffect } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";

/**
 * 성공 상태(enabled)에서 사용자가 필드를 처음 수정하는 순간 한 번만 onReset을 호출한다.
 *
 * enabled일 때만 watch를 구독하고, onReset으로 enabled가 false가 되면 cleanup으로
 * 구독이 해제되므로 onChange마다 실행되지 않고 최초 변경 한 번에만 동작한다.
 */
export default function useResetPreviewOnEdit<T extends FieldValues>(
  watch: UseFormWatch<T>,
  enabled: boolean,
  onReset: () => void
) {
  useEffect(() => {
    if (!enabled) return;

    const subscription = watch((_, { type }) => {
      if (type === "change") onReset();
    });

    return () => subscription.unsubscribe();
  }, [watch, enabled, onReset]);
}
