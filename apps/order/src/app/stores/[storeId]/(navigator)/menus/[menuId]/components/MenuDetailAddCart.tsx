"use client";

import RequestButton from "@spaceorder/ui/components/buttons/RequestButton";
import { useState } from "react";
import { Drawer } from "@spaceorder/ui/components/layouts/drawer";
import MenuAddCartDrawer from "./MenuAddCartDrawer";
import { AxiosError } from "axios";
import { toast } from "@spaceorder/ui/components/sonner";
import { useCartMutations } from "@spaceorder/api/core/cart/useCart.mutate";
import { useMenuDetailContext } from "@spaceorder/ui/components/menu/menu-detail/MenuDetailContext";
import { transCurrencyFormat } from "@spaceorder/ui/utils/menu/priceFormatter";

export default function MenuDetailAddCart() {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const addCartMutate = useCartMutations().add;

  const {
    state: { menu },
    meta: { price },
    actions: { snapshotToFetch },
  } = useMenuDetailContext();

  const addCartThenOpenDrawer = async () => {
    try {
      const fetchableMenu = snapshotToFetch();
      await addCartMutate.mutateAsync(fetchableMenu);
      setIsOpenDrawer(true);
    } catch (error: unknown) {
      let message = "장바구니에 담는 중 오류가 발생했습니다.";
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          message = "세션이 만료되었습니다. 다시 QR코드를 스캔해주세요.";
        }
      }
      toast.error(message);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto">
      <footer className="bg-white border-t border-border p-4">
        <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
          <MenuAddCartDrawer
            description={addCartMutate.data?.notice.message.customer}
          />
        </Drawer>
        <RequestButton
          mutate={addCartMutate}
          message={{
            disabled: "현재 주문이 불가능한 메뉴입니다.",
            error: `${transCurrencyFormat(price)}원 - 장바구니 다시 담기`,
            loading: "장바구니에 추가 중...",
          }}
          className="w-full h-12 font-bold tracking-wide rounded-3xl"
          onClick={addCartThenOpenDrawer}
          disabled={!menu.isAvailable || addCartMutate.isPending}
        >
          {`${transCurrencyFormat(price)}원 - 장바구니 담기`}
        </RequestButton>
      </footer>
    </div>
  );
}
