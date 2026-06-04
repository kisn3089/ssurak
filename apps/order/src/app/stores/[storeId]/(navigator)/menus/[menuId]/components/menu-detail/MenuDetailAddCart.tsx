"use client";

import RequestButton from "@spaceorder/ui/components/RequestButton";
import { useMenuDetailContext } from "./MenuDetailContext";
import { useState } from "react";
import { Drawer } from "@spaceorder/ui/components/drawer";
import MenuAddCartDrawer from "./MenuAddCartDrawer";

export default function MenuDetailAddCart() {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const {
    state: { menu },
    meta: { price, addCartMutate },
    actions: { addCart },
  } = useMenuDetailContext();

  const addCartThenOpenDrawer = () => {
    addCart();
    setIsOpenDrawer(true);
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
            error: `${price.toLocaleString("ko-KR")}원 - 장바구니 다시 담기`,
            loading: "장바구니에 추가 중...",
          }}
          className="w-full h-12 font-bold tracking-wide rounded-3xl"
          onClick={addCartThenOpenDrawer}
          disabled={!menu.isAvailable || addCartMutate.isPending}
        >
          {`${price.toLocaleString("ko-KR")}원 - 장바구니 담기`}
        </RequestButton>
      </footer>
    </div>
  );
}
