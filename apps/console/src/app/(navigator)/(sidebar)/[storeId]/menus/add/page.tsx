import { Button } from "@ssurak/ui/components/buttons/button";
import Link from "next/link";
import { use } from "react";

type AddMenuPageProps = {
  params: Promise<{ storeId: string }>;
};

export default function AddMenuPage({ params }: AddMenuPageProps) {
  const { storeId } = use(params);

  return (
    <div>
      <h1>메뉴 추가 페이지</h1>
      <Link href={`/${storeId}/menus`}>
        <Button>취소</Button>
      </Link>
    </div>
  );
}
