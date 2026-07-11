export default function BoardTableRightLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex gap-x-1 items-center">{children}</div>;
}
