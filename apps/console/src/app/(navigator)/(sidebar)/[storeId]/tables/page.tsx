import { sideTableItem } from "@/shared/config/sidebarGroup";
import PageTitle from "../components/PageTitle";
import HeaderLinkButton from "../components/HeaderLinkButton";
import { Plus } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { Metadata } from "next";
import React, { Suspense, use } from "react";
import TableListHeader from "./components/TableListHeader";
import ConstructTableList from "./components/ConstructTableList";
import TableListSkeleton from "./components/TableListSkeleton";
import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";

export const metadata: Metadata = {
  title: "테이블 설정 - ssurak",
  description:
    "테이블의 상태를 관리하고, 테이블을 추가/삭제할 수 있는 페이지입니다.",
};

export default function SettingTablesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = use(params);

  return (
    <MainLayout>
      <PageTitle title={sideTableItem.title} Icon={sideTableItem.icon}>
        <HeaderLinkButton linkTo="tables/add" icon={<Plus strokeWidth={2.5} />}>
          테이블 추가
        </HeaderLinkButton>
      </PageTitle>
      <Suspense fallback={<TableListSkeleton />}>
        <ServerPrefetch url={`/stores/v1/${storeId}/tables`}>
          <ConstructTableList>
            <TableListHeader />
          </ConstructTableList>
        </ServerPrefetch>
      </Suspense>
    </MainLayout>
  );
}
