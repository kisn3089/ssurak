export default function BoardTableContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <div
      className={`h-full overflow-y-auto scrollbar-hide bg-background rounded-xl border ${className}`}
    >
      {children}
    </div>
  );
}
