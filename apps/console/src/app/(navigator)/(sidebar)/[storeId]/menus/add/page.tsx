import { Button } from "@spaceorder/ui/components/buttons/button";
import Link from "next/link";

type AddMenuPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function AddMenuPage({ params }: AddMenuPageProps) {
  const { storeId } = await params;

  return (
    <div>
      <h1>메뉴 추가 페이지</h1>
      <Link href={`/${storeId}/menus`}>
        <Button>취소</Button>
      </Link>
    </div>
  );
}
