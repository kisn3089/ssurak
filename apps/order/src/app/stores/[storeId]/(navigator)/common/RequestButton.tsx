import { Button } from "@spaceorder/ui/components/button";
import { Separator } from "@spaceorder/ui/components/separator";
import { Spinner } from "@spaceorder/ui/components/spinner";
import { UseMutationResult } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

type RequestButtonProps<Response, Payload> = {
  mutate: UseMutationResult<Response, Error, Payload, unknown>;
  message: {
    disabled?: string;
    error?: string;
    loading?: string;
  };
};

export default function RequestButton<Response, Payload>({
  mutate,
  message,
  ...props
}: ComponentProps<typeof Button> & RequestButtonProps<Response, Payload>) {
  const { disabled, error, loading } = message;

  const buttonMessage = (): ReactNode => {
    if (props.disabled && disabled) {
      return disabled;
    } else if (mutate.isPending && loading) {
      return (
        <>
          <Spinner />
          <p>{loading}</p>
        </>
      );
    } else if (mutate.isError && error) {
      return (
        <>
          <>
            <CircleAlert className="text-destructive" strokeWidth={3} />
            <p>오류</p>
          </>
          <Separator orientation="vertical" className="h-4" />
          <p>{error}</p>
        </>
      );
    } else {
      return props.children;
    }
  };

  return (
    <Button {...props} disabled={props.disabled || mutate.isPending}>
      {buttonMessage()}
    </Button>
  );
}
