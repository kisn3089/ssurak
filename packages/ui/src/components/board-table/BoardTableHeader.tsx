import { CardHeader } from "../layouts/card";

type BoardTableHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function BoardTableHeader({
  children,
  className = "",
}: BoardTableHeaderProps) {
  return (
    <CardHeader
      className={`space-y-0 flex flex-row justify-between items-center gap-1 p-2 ${className}`}
    >
      {children}
    </CardHeader>
  );
}
