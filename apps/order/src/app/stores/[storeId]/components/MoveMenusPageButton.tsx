"use client";

import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MoveMenusPageButton() {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <TouchEventButton
      asChild
      size={"lg"}
      className="w-full h-12 font-semibold rounded-3xl"
    >
      <Link href={`/stores/${storeId}/menus`} className="w-full">
        주문하러 가기
      </Link>
    </TouchEventButton>
  );
}
