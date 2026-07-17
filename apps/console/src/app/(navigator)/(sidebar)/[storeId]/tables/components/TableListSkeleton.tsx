import { Skeleton } from "@ssurak/ui/components/skeleton";
import ConstructTableListLayout from "./ConstructTableListLayout";
import TableListHeader from "./TableListHeader";
import TableInfoRow from "./TableInfoRow";

export default function TableListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ConstructTableListLayout
      body={
        <>
          {Array.from({ length: count }).map((_, index) => (
            <tr key={index} className="border-b last:border-b-0">
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <TableInfoRow key={rowIndex}>
                  <Skeleton className="h-3 p-3" />
                </TableInfoRow>
              ))}
            </tr>
          ))}
        </>
      }
    >
      <TableListHeader />
    </ConstructTableListLayout>
  );
}
