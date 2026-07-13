import { Button } from "@ssurak/ui/components/buttons/button";
import { Spinner } from "@ssurak/ui/components/spinner";

type TableOrderErrorProps = {
  onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  isError: boolean;
  isLoading: boolean;
};
export default function TableOrderItemError({
  onRetry,
  disabled,
  isError,
  isLoading,
}: TableOrderErrorProps) {
  if (!isError) return null;

  return (
    <Button
      className="w-full mb-2"
      variant={"destructive"}
      onClick={onRetry}
      disabled={disabled}
    >
      {isLoading ? <Spinner /> : "다시 시도"}
    </Button>
  );
}
