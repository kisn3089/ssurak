"use client";

import { Button } from "@spaceorder/ui/components/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@spaceorder/ui/components/drawer";
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
        <Button asChild variant="outline" className="flex-1 py-5 rounded-3xl">
          <Link href={`/stores/${storeId}/carts`}>장바구니로 이동</Link>
        </Button>
        <Button
          className="flex-1 py-5 rounded-3xl"
          onClick={() => router.push(`/stores/${storeId}/menus`)}
        >
          다른 메뉴 더 보기
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}
