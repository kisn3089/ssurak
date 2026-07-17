import { cn } from "@ssurak/ui/lib/utils";

interface TableInfoRowProps {
  children: React.ReactNode;
  className?: string;
}

export default function TableInfoRow({
  children,
  className = "",
}: TableInfoRowProps) {
  return (
    <td className="text-left p-4 first:pl-4">
      <div className={cn(className, "text-ellipsis max-w-32")}>
        <span className="overflow-hidden whitespace-nowrap max-w-full">
          {children}
        </span>
      </div>
    </td>
  );
}
