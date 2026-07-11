import { Button } from "@spaceorder/ui/components/buttons/button";
import { Separator } from "@spaceorder/ui/components/forms/separator";
import { Spinner } from "@spaceorder/ui/components/spinner";
import { CircleAlert } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

type RequestButtonProps = {
  mutate: {
    isPending: boolean;
    isError: boolean;
  };
  message?: {
    disabled?: string;
    error?: string;
    loading?: string;
  };
};

export default function RequestButton({
  mutate,
  message,
  ...props
}: ComponentProps<typeof Button> & RequestButtonProps) {
  const buttonMessage = (): ReactNode => {
    if (mutate.isPending) {
      return (
        <>
          <Spinner />
          {message?.loading && <p>{message.loading}</p>}
        </>
      );
    } else if (props.disabled) {
      return message?.disabled ?? props.children;
    } else if (mutate.isError) {
      return (
        <>
          <CircleAlert className="text-destructive" strokeWidth={3} />
          <p>오류</p>
          <Separator orientation="vertical" className="h-4" />
          {message?.error && <p>{message.error}</p>}
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
