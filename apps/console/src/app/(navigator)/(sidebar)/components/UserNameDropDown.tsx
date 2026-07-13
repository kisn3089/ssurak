"use client";

import {
  SidebarMenuButton,
  useSidebar,
} from "@ssurak/ui/components/layouts/sidebar";
import { ShieldUser } from "lucide-react";
import { Suspense } from "react";
import { Spinner } from "@ssurak/ui/components/spinner";
import UserInfoDropdown from "./UserInfoDropdown";
import UserName from "./UserName";

export default function UserNameDropDown() {
  const { open } = useSidebar();

  if (!open) {
    return null;
  }

  return (
    <UserInfoDropdown>
      <SidebarMenuButton className="gap-0" variant={"outline"}>
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
