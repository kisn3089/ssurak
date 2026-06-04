"use client";

import { Button } from "@spaceorder/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@spaceorder/ui/components/sheet";
import { toast } from "@spaceorder/ui/components/sonner";
import { Copy, QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type QrCodeModalProps = {
  tableNumber: number;
  qrCode: string;
  disabled?: boolean;
};

export default function TableOrderQrCode({
  tableNumber,
  qrCode,
  disabled,
}: QrCodeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const preventEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const copyUrlToClipboard = () => {
    const orderAppUrl = process.env.NEXT_PUBLIC_ORDER_APP_URL;
    if (!orderAppUrl) {
      toast.error("주문 앱 URL이 설정되지 않았습니다.", {
        position: "top-center",
      });
      return;
    }

    const url = `${orderAppUrl}/qr/${qrCode}`;
    const copiedSuccess = () =>
      toast.success("URL이 클립보드에 복사되었습니다!", {
        position: "top-center",
      });
    setIsOpen(false);
    const copiedError = (err: unknown) => {
      toast.error("URL 복사에 실패했습니다.", { position: "top-center" });
      console.error("Clipboard write failed: ", err);
    };

    navigator.clipboard.writeText(url).then(copiedSuccess, copiedError);
  };

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={preventEvent}>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon-sm"}
            className="transition-none"
            disabled={disabled}
          >
            <QrCode />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="gap-0">
          <SheetHeader>
            <SheetTitle className="text-center">테이블 QR</SheetTitle>
            <SheetDescription className="text-center">
              {tableNumber}번 테이블 주문용 QR 코드입니다.
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Button onClick={copyUrlToClipboard}>
              <span className="text-sm font-semibold">{"URL 복사하기"}</span>
              <Copy />
            </Button>
          </div>
          <Image
            src={`/img/table_${tableNumber}.png`}
            alt={`QR code for table ${tableNumber}`}
            width={300}
            height={300}
            className="mx-auto mb-4 rounded-xl"
            style={{ width: "auto", height: "auto" }}
          />
        </SheetContent>
      </div>
    </Sheet>
  );
}
