"use client";

import { DialogTrigger } from "@spaceorder/ui/components/layouts/dialog";
import { useParams } from "next/navigation";
import CreateOrderDialog from "./create-order/CreateOrderDialog";
import TouchEventButton from "@spaceorder/ui/components/buttons/TouchEventButton";

export function OrderDetailControlbar() {
  const { tableId } = useParams<{ tableId: string }>();

  return (
    <div className="grid grid-cols-2 gap-2">
      <TouchEventButton
        disabled
        className="h-[clamp(4rem,6vw,6rem)] font-bold text-xl tracking-wider rounded-2xl"
        variant="secondary"
      >
        할인
      </TouchEventButton>
      <CreateOrderDialog>
        <DialogTrigger asChild>
          <TouchEventButton
            disabled={!tableId}
            className="h-[clamp(4rem,6vw,6rem)] font-bold text-xl tracking-wider rounded-2xl"
          >
            추가 주문
          </TouchEventButton>
        </DialogTrigger>
      </CreateOrderDialog>
    </div>
  );
}
