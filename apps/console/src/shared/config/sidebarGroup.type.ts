export interface SidebarGroup {
  groupTitle: string;
  groupItems: SidebarGroupItem[];
}

export interface SidebarGroupItem {
  title: string;
  /** 매장 스코프 하위 세그먼트. 실제 href는 `/{storeId}/{segment}`로 구성된다. */
  segment: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
