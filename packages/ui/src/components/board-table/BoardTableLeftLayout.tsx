export default function BoardTableLeftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex items-center gap-x-2">{children}</div>;
}
