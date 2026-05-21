"use client";

import useSuspenseWithSession from "@spaceorder/api/hooks/useSuspenseWithSession";
import { PublicCategoryWithMenus, StoreContext } from "@spaceorder/db/types";
import CategoryLine from "./CategoryLine";
import { Fragment } from "react";
import MenuList from "./MenuList";

export default function CategoryMenuList({
  categoryRefs,
}: {
  categoryRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}) {
  const { data: categories } = useSuspenseWithSession<
    StoreContext,
    PublicCategoryWithMenus[]
  >("/stores/v1/sessions/me/store-context", {
    queryOptions: {
      select: (storeContext) => storeContext.table.store.categories,
    },
  });

  return (
    <>
      {categories.map((category, index) => (
        <Fragment key={category.name}>
          <CategoryLine
            category={category.name}
            ref={(el) => {
              if (el) {
                categoryRefs.current.set(category.name, el);
              } else {
                categoryRefs.current.delete(category.name);
              }
            }}
          />
          <MenuList menus={category.menus} priority={index === 0} />
        </Fragment>
      ))}
    </>
  );
}
