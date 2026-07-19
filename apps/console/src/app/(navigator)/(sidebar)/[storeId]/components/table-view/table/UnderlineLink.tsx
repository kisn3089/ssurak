import Link from "next/link";

export default function UnderlineLink({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className="underline underline-offset-1 cursor-pointer focus-visible:outline-none focus-visible:underline-offset-1 focus-visible:decoration-blue-500 focus-visible:text-blue-500"
      {...props}
    >
      {children}
    </Link>
  );
}
