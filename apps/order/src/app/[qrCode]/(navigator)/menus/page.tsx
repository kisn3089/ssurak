"use client";

// import { Metadata } from "next";
import Categories from "./components/Categories";
import CategoryMenuList from "./components/CategoryMenuList";

// export const metadata: Metadata = {
//   title: "메뉴 - TADER",
//   description: "메뉴를 확인하고 주문해보세요.",
// };

export default function MenuListPage() {
  return <Categories>{menusWithCategory}</Categories>;
}

function menusWithCategory(
  categoryRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
) {
  return (
    <section>
      <CategoryMenuList categoryRefs={categoryRefs} />
    </section>
  );
}
