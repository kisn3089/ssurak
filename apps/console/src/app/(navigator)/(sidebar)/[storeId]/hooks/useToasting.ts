import { useSonner } from "@ssurak/ui/components/sonner";

export default function useToasting() {
  const { toasts } = useSonner();

  function isActioning(toastIds: string[]) {
    return toasts.some(
      (activeToast) =>
        activeToast.type === "loading" &&
        toastIds.some((toastId) => activeToast.id === toastId)
    );
  }

  return { isActioning };
}
