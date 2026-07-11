import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";
import Link from "next/link";
import { ComponentProps } from "react";

type HeaderLinkButtonProps = {
  linkTo: string;
  icon?: React.ReactNode;
} & ComponentProps<typeof TouchEventButton>;

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
      <TouchEventButton swallowEvent={false} {...props}>
        {iconElement}
      </TouchEventButton>
    </Link>
  );
}
