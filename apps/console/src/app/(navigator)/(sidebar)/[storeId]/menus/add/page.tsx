import { Button } from "@ssurak/ui/components/buttons/button";
import Link from "next/link";
import { use } from "react";
import SectionLayout from "../../components/SectionLayout";

const description =
  "메뉴를 추가하여 주문을 받을 수 있습니다. 메뉴는 매장 내에서 판매되는 상품을 의미하며, 각 메뉴마다 주문을 구분할 수 있습니다.";

type AddMenuPageProps = {
  params: Promise<{ storeId: string }>;
};

export default function AddMenuPage({ params }: AddMenuPageProps) {
  const { storeId } = use(params);

  return (
    <SectionLayout title="메뉴 추가" description={description}>
      <Link href={`/${storeId}/menus`}>
        <Button>취소</Button>
      </Link>
    </SectionLayout>
  );
}
