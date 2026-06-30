"use client";

import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@spaceorder/ui/components/layouts/drawer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function MenuAddCartDrawer({
  description,
}: {
  description: string | undefined;
}) {
  const router = useRouter();
  const { storeId } = useParams<{ storeId: string }>();
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-center">
          장바구니에 추가되었습니다 🎉
        </DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter className="flex flex-row justify-center gap-x-4 mb-4">
        <TouchEventButton
          asChild
          variant="outline"
          className="flex-1 py-5 rounded-3xl"
        >
          <Link href={`/stores/${storeId}/carts`}>장바구니로 이동</Link>
        </TouchEventButton>
        <TouchEventButton
          className="flex-1 py-5 rounded-3xl"
          onClick={() => router.push(`/stores/${storeId}/menus`)}
        >
          다른 메뉴 더 보기
        </TouchEventButton>
      </DrawerFooter>
    </DrawerContent>
  );
}
