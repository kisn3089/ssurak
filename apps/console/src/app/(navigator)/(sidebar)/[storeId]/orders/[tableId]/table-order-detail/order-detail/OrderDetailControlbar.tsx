"use client";

import { DialogTrigger } from "@ssurak/ui/components/layouts/dialog";
import { useParams } from "next/navigation";
import CreateOrderDialog from "./create-order/CreateOrderDialog";
import { Button } from "@ssurak/ui/components/buttons/button";

export function OrderDetailControlbar() {
  const { tableId } = useParams<{ tableId: string }>();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        disabled
        className="h-[clamp(4rem,6vw,6rem)] font-bold text-xl tracking-wider rounded-2xl"
        variant="secondary"
      >
        할인
      </Button>
      <CreateOrderDialog>
        <DialogTrigger asChild>
          <Button
            disabled={!tableId}
            className="h-[clamp(4rem,6vw,6rem)] font-bold text-xl tracking-wider rounded-2xl"
          >
            추가 주문
          </Button>
        </DialogTrigger>
      </CreateOrderDialog>
    </div>
  );
}
