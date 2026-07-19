import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import { Metadata } from "next";
import { use } from "react";
import SectionLayout from "../../../components/SectionLayout";
import TableEditForm from "../components/TableEditForm";
import { TableDetailPageProps } from "../page";

const description =
  "테이블의 정보를 수정할 수 있습니다. 수정된 테이블의 정보는 고객에게 바로 반영됩니다. 테이블 번호는 중복될 수 없으며, 테이블의 활성화 상태를 변경할 수 있습니다.";

export const metadata: Metadata = {
  title: "테이블 수정 - ssurak",
  description: "테이블의 상태를 수정하는 페이지입니다.",
};

export default function TableEditPage({ params }: TableDetailPageProps) {
  const { storeId, tableId } = use(params);

  return (
    <SectionLayout title="테이블 수정" description={description}>
      <ServerPrefetch url={`/stores/v1/${storeId}/tables`}>
        <ServerPrefetch url={`/stores/v1/${storeId}/tables/${tableId}`}>
          <TableEditForm />
        </ServerPrefetch>
      </ServerPrefetch>
    </SectionLayout>
  );
}
