import { sideTableItem } from "@/shared/config/sidebarGroup";
import PageTitle from "../components/PageTitle";
import HeaderLinkButton from "../components/HeaderLinkButton";
import { Plus } from "lucide-react";

export default function TablesSettingPage() {
  return (
    <PageTitle title={sideTableItem.title} Icon={sideTableItem.icon}>
      <HeaderLinkButton linkTo="tables/add" icon={<Plus strokeWidth={2.5} />}>
        <span>테이블 추가</span>
      </HeaderLinkButton>
    </PageTitle>
  );
}
