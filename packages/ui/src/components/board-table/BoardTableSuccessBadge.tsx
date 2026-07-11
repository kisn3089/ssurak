import { Badge } from "../forms/badge";

export default function BoardTableSuccessBadge({
  isSuccess,
}: {
  isSuccess: boolean | undefined;
}) {
  if (!isSuccess) return null;

  return (
    <Badge className="border-transparent text-xs font-bold py-1 bg-green-600 text-white">
      완료
    </Badge>
  );
}
