"use client";

import { Table } from "@ssurak/api/types/table/table.interface";
import TableListView from "./TableListView";
import { Pagination } from "@ssurak/ui/components/pagination";
import { useState } from "react";
import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import { useParams } from "next/navigation";
import ConstructTableListLayout from "./ConstructTableListLayout";

const MAX_SIZE = 10;

interface ConstructTableListProps {
  children: React.ReactNode;
}

export default function ConstructTableList({
  children,
}: ConstructTableListProps) {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: tableList } = useSuspenseWithAuth<Table[]>(
    `/stores/v1/${storeId}/tables`
  );
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tableList.length / MAX_SIZE));
  const currentPage = Math.min(page, totalPages);

  const filteredTableList = tableList.slice(
    (currentPage - 1) * MAX_SIZE,
    currentPage * MAX_SIZE
  );

  return (
    <>
      <ConstructTableListLayout
        body={<TableListView tableList={filteredTableList} />}
      >
        {children}
      </ConstructTableListLayout>
      <footer className="pt-8">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          disabled={false}
        />
      </footer>
    </>
  );
}
