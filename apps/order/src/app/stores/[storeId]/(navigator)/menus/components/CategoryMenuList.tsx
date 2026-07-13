"use client";

import useSuspenseWithSession from "@ssurak/api/hooks/useSuspenseWithSession";
import { CategoryWithMenusResponse } from "@ssurak/api/types/category/category.interface";
import { StoreContextResponse } from "@ssurak/api/types/store/store.interface";
import CategoryLine from "./CategoryLine";
import MenuList from "./MenuList";

export default function CategoryMenuList({
  categoryRefs,
}: {
  categoryRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}) {
  const { data: categories } = useSuspenseWithSession<
    StoreContextResponse,
    CategoryWithMenusResponse[]
  >("/stores/v1/sessions/me/store-context", {
    queryOptions: {
      select: (storeContext) => storeContext.table.store.categories,
    },
  });

  return (
    <>
      {categories.map((category, index) => (
        <div
          key={category.name}
          ref={(el) => {
            if (el) {
              categoryRefs.current.set(category.name, el);
            } else {
              categoryRefs.current.delete(category.name);
            }
          }}
        >
          <CategoryLine category={category.name} />
          <MenuList menus={category.menus} priority={index === 0} />
        </div>
      ))}
    </>
  );
}
