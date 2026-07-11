"use client";

import { SIDEBAR_GROUP } from "@/shared/config/sidebarGroup";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@spaceorder/ui/components/layouts/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function SidebarGroups() {
  const pathname = usePathname();
  const { storeId } = useParams<{ storeId?: string }>();

  return (
    <>
      {SIDEBAR_GROUP.map((group) => (
        <SidebarGroup key={group.groupTitle}>
          <SidebarGroupLabel className="whitespace-nowrap">
            {group.groupTitle}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.groupItems.map((sidebarItem) => (
                <SidebarMenuItem key={sidebarItem.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(`/${sidebarItem.segment}`)}
                    aria-disabled={!storeId}
                  >
                    <Link
                      href={
                        storeId ? `/${storeId}/${sidebarItem.segment}` : "#"
                      }
                    >
                      <sidebarItem.icon />
                      <span>{sidebarItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
