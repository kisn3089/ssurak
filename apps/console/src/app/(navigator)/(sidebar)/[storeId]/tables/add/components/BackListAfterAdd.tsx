import { Button } from "@spaceorder/ui/components/buttons/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BackListAfterAdd({
  isSuccess,
}: {
  isSuccess: boolean;
}) {
  const { storeId } = useParams<{ storeId: string }>();
  if (!isSuccess) return null;

  return (
    <div className="pb-4 animate-tzRise">
      <Link href={`/${storeId}/tables`}>
        <Button type="button" className="w-full rounded-xl font-bold h-11">
          테이블 목록으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
