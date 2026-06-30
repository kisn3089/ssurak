import { PublicCategoryWithMenus } from "@spaceorder/db/types";
import {
  TabsList,
  TabsTrigger,
} from "@spaceorder/ui/components/animate-ui/components/tabs";

export default function CategoryTabList({
  categories,
}: {
  categories: PublicCategoryWithMenus[];
}) {
  return (
    <TabsList>
      {categories.map((category) => (
        <TabsTrigger
          key={category.publicId}
          value={category.publicId}
          className="cursor-pointer data-[state=active]:bg-background"
        >
          {category.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
