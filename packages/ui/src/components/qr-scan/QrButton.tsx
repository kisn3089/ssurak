import { QrCode } from "lucide-react";
import { Button } from "../buttons/button";
import { forwardRef } from "react";

type QrButtonProps = React.ComponentProps<typeof Button> & {
  isSuccess?: boolean;
};

const QrButton = forwardRef<HTMLButtonElement, QrButtonProps>(
  ({ disabled, isSuccess, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={"outline"}
        size={"icon-sm"}
        className={`transition-none ${isSuccess ? "border-[#d6ecdd]" : ""}`}
        disabled={disabled}
        {...props}
      >
        <QrCode className={isSuccess ? "text-green-600" : ""} />
      </Button>
    );
  }
);

QrButton.displayName = "QrButton";

export default QrButton;
