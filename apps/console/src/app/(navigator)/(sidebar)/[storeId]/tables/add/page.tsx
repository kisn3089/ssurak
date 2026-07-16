import SectionLayout from "../../components/SectionLayout";
import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import { use } from "react";
import AddTableForm from "./components/AddTableForm";

const description =
  "테이블을 추가하여 주문을 받을 수 있습니다. 테이블은 매장 내 좌석을 의미하며, 각 테이블마다 주문을 구분할 수 있습니다.";

type AddTablePageProps = {
  params: Promise<{ storeId: string }>;
};

export default function AddTablePage({ params }: AddTablePageProps) {
  const { storeId } = use(params);

  return (
    <SectionLayout title="테이블 추가" description={description}>
      <ServerPrefetch url={`/stores/v1/${storeId}/tables`}>
        <AddTableForm />
      </ServerPrefetch>
    </SectionLayout>
  );
}
