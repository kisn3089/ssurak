"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ssurak/ui/components/layouts/dialog";
import CategoryList from "./category-list/CategoryList";
import { Suspense, useState } from "react";
import { Spinner } from "@ssurak/ui/components/spinner";
import { CreateOrderProvider } from "./CreateOrderProvider";
import AddMenuDetail from "./add-menu-detail/AddMenuDetail";

type AddMenuProps = {
  children: React.ReactNode;
};

export default function CreateOrderDialog({ children }: AddMenuProps) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const closeDialog = () => setIsOpenDialog(false);

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      {children}
      <DialogContent className="w-4/5 max-w-6xl min-h-[500px] h-4/5 flex flex-col bg-accent-subtle">
        <DialogHeader>
          <DialogTitle>주문 생성</DialogTitle>
          <DialogDescription>추가할 메뉴를 선택해주세요.</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<Spinner />}>
          <CreateOrderProvider>
            <CategoryList />
            <AddMenuDetail closeDialog={closeDialog} />
          </CreateOrderProvider>
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
