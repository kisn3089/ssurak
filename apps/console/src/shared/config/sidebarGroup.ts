import {
  ConciergeBell,
  Grid2X2Plus,
  LayoutDashboard,
  Utensils,
} from "lucide-react";
import { SidebarGroup } from "./sidebarGroup.type";

const sideDashboardItem = {
  title: "대시보드",
  segment: "dashboard",
  icon: LayoutDashboard,
};

const sideOrderBoardItem = {
  title: "주문 현황",
  segment: "orders",
  icon: ConciergeBell,
};

const OrderGroup: SidebarGroup = {
  groupTitle: "주문",
  groupItems: [sideDashboardItem, sideOrderBoardItem],
};

export const sideMenuItem = {
  title: "메뉴 관리",
  segment: "menus",
  icon: Utensils,
};

export const sideTableItem = {
  title: "테이블 관리",
  segment: "tables",
  icon: Grid2X2Plus,
};

const StoreGroup: SidebarGroup = {
  groupTitle: "매장",
  groupItems: [sideMenuItem, sideTableItem],
};

export const SIDEBAR_GROUP: SidebarGroup[] = [OrderGroup, StoreGroup];
