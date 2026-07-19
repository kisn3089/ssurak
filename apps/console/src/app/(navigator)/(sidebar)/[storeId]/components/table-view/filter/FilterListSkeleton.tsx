import { Skeleton } from "@ssurak/ui/components/skeleton";
import FilterLayout from "./FilterLayout";

export default function FilterListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <FilterLayout>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-3 py-4 px-6 w-20" />
      ))}
    </FilterLayout>
  );
}
