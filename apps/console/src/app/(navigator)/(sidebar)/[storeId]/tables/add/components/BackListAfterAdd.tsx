"use client";

import { Button } from "@ssurak/ui/components/buttons/button";
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
      <Button
        asChild
        type="button"
        className="w-full rounded-xl font-bold h-11"
      >
        <Link href={`/${storeId}/tables`}>테이블 목록으로 돌아가기</Link>
      </Button>
    </div>
  );
}
