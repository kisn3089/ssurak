import { CategoryWithMenusResponse } from "@ssurak/api/types/category/category.interface";
import {
  TabsList,
  TabsTrigger,
} from "@ssurak/ui/components/animate-ui/components/tabs";

export default function CategoryTabList({
  categories,
}: {
  categories: CategoryWithMenusResponse[];
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
