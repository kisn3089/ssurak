import { cn } from "@ssurak/ui/lib/utils";

interface TableInfoRowProps {
  children: React.ReactNode;
  className?: string;
  overflowVisible?: boolean;
}

export default function TableInfoRow({
  children,
  className = "",
  overflowVisible = false,
}: TableInfoRowProps) {
  return (
    <td className={cn("text-left p-4 first:pl-4", className)}>
      <div
        className={`${overflowVisible ? "" : "line-clamp-1"} text-ellipsis max-w-32`}
      >
        <span className="overflow-hidden whitespace-nowrap max-w-full">
          {children}
        </span>
      </div>
    </td>
  );
}
