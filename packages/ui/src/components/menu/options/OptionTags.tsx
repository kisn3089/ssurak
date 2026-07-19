import { Badge } from "@ssurak/ui/components/forms/badge";

export default function OptionTags({
  options,
  variant,
}: {
  options: Record<string, string> | undefined;
  variant: "destructive" | "secondary";
}) {
  const entries = Object.entries(options || {});
  if (entries.length === 0) return null;

  return (
    <div className="flex gap-x-1">
      {entries.map(([key, value]) => (
        <Badge
          key={key}
          variant={variant}
          className="whitespace-pre-wrap text-center tabular-nums"
        >
          {value}
        </Badge>
      ))}
    </div>
  );
}
