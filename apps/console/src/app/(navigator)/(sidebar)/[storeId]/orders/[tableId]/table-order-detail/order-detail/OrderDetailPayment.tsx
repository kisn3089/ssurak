"use client";

import { AlertDialogWrapper } from "@spaceorder/ui/components/alert-dialog/AlertDialogWrapper";
import { useOrderDetailContext } from "./OrderDetailContext";
import PaymentDialogControlbar from "./PaymentDialogControlbar";
import { Dispatch, SetStateAction } from "react";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";
import { Button } from "@spaceorder/ui/components/buttons/button";

export function OrderDetailPayment() {
  const {
    state: { totalPrice },
  } = useOrderDetailContext();
  const formattedPrice = transCurrencyFormat(totalPrice);

  const showPaymentController = (
    setOpen: Dispatch<SetStateAction<boolean>>
  ) => (
    <PaymentDialogControlbar setOpen={setOpen}>
      {`${formattedPrice}원 결제`}
    </PaymentDialogControlbar>
  );

  return (
    <AlertDialogWrapper
      title="결제 처리 하시겠습니까?"
      description="해당 테이블의 주문 내역이 초기화됩니다."
      renderFooter={showPaymentController}
    >
      <Button className="h-[clamp(4rem,6vw,6rem)] font-bold text-xl tracking-wider rounded-2xl">
        {`${formattedPrice}원 결제`}
      </Button>
    </AlertDialogWrapper>
  );
}
