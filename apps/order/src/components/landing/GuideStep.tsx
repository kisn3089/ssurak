import Timeline, { type TimelineStep } from "@/components/Timeline";

const STEPS: TimelineStep[] = [
  {
    label: "01",
    title: "QR 코드 스캔",
    description: "테이블마다 QR 코드가 있어요",
  },
  {
    label: "02",
    title: "메뉴 담기",
    description: "원하는 메뉴를 골라 장바구니에 추가하세요",
  },
  {
    label: "03",
    title: "주문 · 결제",
    description: "직원 호출 없이 자리에서 바로 주문하세요",
  },
];

export default function GuideStep() {
  return <Timeline steps={STEPS} className="mt-7" />;
}
