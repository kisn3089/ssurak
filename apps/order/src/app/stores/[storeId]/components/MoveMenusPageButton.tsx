"use client";

import { Button } from "@spaceorder/ui/components/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MoveMenusPageButton() {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Link href={`/stores/${storeId}/menus`} className="w-full">
      <Button size={"lg"} className="w-full font-semibold">
        주문하러 가기
      </Button>
    </Link>
  );
}
