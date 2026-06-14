import QrScan from "@spaceorder/ui/components/qr-scan/QrScan";

export default function SessionExpiredError() {
  return (
    <main className="landing-layout min-h-dvh w-full flex flex-col items-center">
      <section className="flex-1 flex flex-col items-center justify-center gap-4 mb-30">
        <h2 className="text-2xl font-bold whitespace-pre-line text-center">
          {`주문 가능한 시간이\n만료되었습니다.`}
        </h2>
        <p className="text-muted-foreground mb-8">
          다시 QR 코드를 스캔하여 주문을 시작해주세요.
        </p>
        <QrScan />
      </section>
    </main>
  );
}
