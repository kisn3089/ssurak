import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@spaceorder/ui/lib/utils";
import { Spinner } from "../spinner";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-tiny font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border border-border bg-secondary text-secondary-foreground",
        destructive: "border border-red-200 bg-red-100 text-red-500",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  isLoading?: boolean;
}

function Badge({
  className,
  variant,
  isLoading,
  children,
  ...props
}: BadgeProps) {
  const loadingVariants = isLoading
    ? `opacity-50 cursor-not-allowed pointer-events-none`
    : "";

  return (
    <div
      className={cn(badgeVariants({ variant }), className, loadingVariants)}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </div>
  );
}

export { Badge, badgeVariants };
