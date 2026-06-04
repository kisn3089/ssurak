export default function OrdersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border h-full flex flex-col justify-between shadow-sm w-xl min-w-xs">
      {children}
    </div>
  );
}
