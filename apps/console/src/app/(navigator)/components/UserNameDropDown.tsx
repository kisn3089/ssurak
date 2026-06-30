import { SidebarMenuButton } from "@spaceorder/ui/components/layouts/sidebar";
import UserInfoDropdown from "../(sidebar)/components/UserInfoDropdown";
import { ShieldUser } from "lucide-react";
import UserName from "../(sidebar)/components/UserName";
import { Suspense } from "react";
import { Spinner } from "@spaceorder/ui/components/spinner";

export default function UserNameDropDown() {
  return (
    <UserInfoDropdown>
      <SidebarMenuButton variant={"outline"}>
        <ShieldUser />
        <Suspense
          fallback={
            <div className="w-full grid place-content-center">
              <Spinner />
            </div>
          }
        >
          <UserName />
        </Suspense>
      </SidebarMenuButton>
    </UserInfoDropdown>
  );
}
