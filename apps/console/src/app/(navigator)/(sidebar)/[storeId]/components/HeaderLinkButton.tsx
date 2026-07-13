import { Button } from "@ssurak/ui/components/buttons/button";
import Link from "next/link";
import { ComponentProps } from "react";

type HeaderLinkButtonProps = {
  linkTo: string;
  icon?: React.ReactNode;
} & ComponentProps<typeof Button>;

export default function HeaderLinkButton({
  children,
  icon,
  linkTo,
  ...props
}: HeaderLinkButtonProps) {
  const iconElement = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );
  return (
    <Link href={linkTo} className="w-fit">
      <Button {...props}>{iconElement}</Button>
    </Link>
  );
}
