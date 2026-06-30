"use client";

import {
  Tabs,
  TabsContent,
  TabsContents,
} from "@spaceorder/ui/components/animate-ui/components/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@spaceorder/ui/components/layouts/card";
import CategoryTabList from "./CategoryTabList";
import { useCreateOrderContext } from "../CreateOrderProvider";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";
import TouchFeedback from "@spaceorder/ui/components/animate-ui/components/TouchFeedback";

export default function CategoryList() {
  const {
    state: { categories, selectedMenu },
    actions: { selectMenu },
  } = useCreateOrderContext();

  return (
    <div>
      <Tabs defaultValue={categories[0]?.publicId}>
        <CategoryTabList categories={categories} />
        <TabsContents>
          {categories.map((category) => (
            <TabsContent
              value={category.publicId}
              key={category.publicId}
              className="flex gap-2 flex-wrap p-1"
            >
              {category.menus.map((menu) => (
                <TouchFeedback key={menu.publicId}>
                  {({ isTouched, touchProps, mouseProps }) => (
                    <button
                      onClick={() => menu.isAvailable && selectMenu(menu)}
                    >
                      <Card
                        className={`min-w-[140px] max-w-[140px] min-h-[140px] flex flex-col justify-between cursor-pointer shadow-md rounded-3xl hover:bg-accent transition-transform duration-75 ${selectedMenu?.publicId === menu.publicId ? "bg-accent" : ""} ${isTouched ? "scale-95" : ""} ${menu.isAvailable ? "" : "opacity-50 pointer-events-none"}`}
                        {...touchProps}
                        {...mouseProps}
                      >
                        <CardHeader className="p-3 text-start">
                          <CardTitle className="text-lg">{menu.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 text-end font-semibold">
                          {transCurrencyFormat(menu.price)}
                        </CardContent>
                      </Card>
                    </button>
                  )}
                </TouchFeedback>
              ))}
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>
    </div>
  );
}
