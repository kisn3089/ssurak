import { Check } from "lucide-react";
import { useBoardTableContext } from "./BoardTableContext";

export default function BoardTableSuccessContent({
  successText,
  isSuccess,
}: {
  successText: string;
  isSuccess?: boolean;
}) {
  const { tableNumber, floor, seats, section } = useBoardTableContext(
    "BoardTableSuccessContent"
  );

  if (!isSuccess) return null;

  const summary = [
    [tableNumber, section].filter(Boolean).join(" "),
    seats ? `좌석 ${seats}` : null,
    floor ? `${floor}층` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-3 p-4 text-center">
      <span className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-green-500 animate-tzRing" />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-green-600 text-white animate-tzPop">
          <Check
            className="size-9 animate-tzDraw"
            strokeWidth={3}
            style={{ strokeDasharray: 24, strokeDashoffset: 24 }}
          />
        </span>
      </span>
      <div className="flex flex-col gap-y-1">
        <p className="text-lg font-extrabold">{successText}</p>
        {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
      </div>
    </div>
  );
}
