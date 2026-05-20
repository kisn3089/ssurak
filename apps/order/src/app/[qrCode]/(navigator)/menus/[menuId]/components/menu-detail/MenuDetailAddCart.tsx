import { AddCartItemPayload, useCartMutations } from "@spaceorder/api/core";
import { Button } from "@spaceorder/ui/components/button";
import { useMenuDetailContext } from "./MenuDetailContext";
import { deleteNotTriggeredOptions } from "@/utils/optionTrigger";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Separator } from "@spaceorder/ui/components/separator";

export default function MenuDetailAddCart() {
  const {
    state: { menu, quantity, selectedOptions },
    meta: { allOptions, allSelectedOptions },
  } = useMenuDetailContext();
  const cartMutate = useCartMutations();

  if (cartMutate.add.failureReason) {
    throw cartMutate.add.failureReason;
  }

  const price =
    quantity *
    (menu.price +
      allOptions.reduce((acc, option) => {
        const selectedKey = allSelectedOptions.get(option.key);
        const selectedOption = option.optionInfo.options.find(
          (opt) => opt.key === selectedKey
        );
        return acc + (selectedOption ? selectedOption.price : 0);
      }, 0));

  const addToCart = async () => {
    const deletedNotTriggeredOptions = deleteNotTriggeredOptions(
      allOptions,
      selectedOptions.custom,
      allSelectedOptions
    );

    const cartItem: AddCartItemPayload = {
      menuPublicId: menu.publicId,
      quantity,
      requiredOptions: Object.fromEntries(selectedOptions["required"]),
      customOptions: Object.fromEntries(deletedNotTriggeredOptions),
    };

    try {
      await cartMutate.add.mutateAsync(cartItem);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          throw new AxiosError(
            "세션이 만료되었습니다. 다시 QR코드를 스캔해주세요."
          );
        }
      }
    }
  };

  const buttonMessage = (): ReactNode => {
    if (!menu.isAvailable) {
      return "현재 주문이 불가능한 메뉴입니다.";
    } else if (cartMutate.add.isPending) {
      return "장바구니에 추가 중...";
    } else if (cartMutate.add.isError) {
      return (
        <>
          <>
            <CircleAlert className="text-destructive" strokeWidth={3} />
            <p>오류</p>
          </>
          <Separator orientation="vertical" className="h-4" />
          {price.toLocaleString("ko-KR")}원 - 장바구니 다시 담기
        </>
      );
    } else {
      return `${price.toLocaleString("ko-KR")}원 - 장바구니 담기`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto">
      <footer className="bg-white border-t border-border p-4">
        <Button
          className="w-full h-12 font-bold tracking-wide"
          onClick={addToCart}
          disabled={!menu.isAvailable || cartMutate.add.isPending}
        >
          {buttonMessage()}
        </Button>
      </footer>
    </div>
  );
}
