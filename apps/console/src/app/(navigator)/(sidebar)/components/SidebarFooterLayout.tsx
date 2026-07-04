import RealtimeStatusDot from "@/components/realtime/RealtimeStatusDot";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@spaceorder/ui/components/layouts/sidebar";
import UserNameDropDown from "../../components/UserNameDropDown";
import { Button } from "@spaceorder/ui/components/buttons/button";

export default function SidebarFooterLayout() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem key={"realtimeStatus"}>
          <RealtimeStatusDot />
        </SidebarMenuItem>
        <SidebarMenuItem className="flex gap-x-1.5" key={"userName"}>
          <Button
            asChild
            variant={"outline"}
            size={"icon-sm"}
            className="shadow-none"
          >
            <SidebarTrigger />
          </Button>
          <UserNameDropDown />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
