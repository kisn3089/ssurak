import { sideMenuItem } from "@/shared/config/sidebarGroup";
import PageTitle from "../../components/PageTitle";
import HeaderLinkButton from "../../components/HeaderLinkButton";
import { Plus } from "lucide-react";

export default function MenusSettingPage() {
  return (
    <PageTitle title={sideMenuItem.title} Icon={sideMenuItem.icon}>
      <HeaderLinkButton linkTo="menus/add" icon={<Plus strokeWidth={2.5} />}>
        <span>메뉴 추가</span>
      </HeaderLinkButton>
    </PageTitle>
  );
}
