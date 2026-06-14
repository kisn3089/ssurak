import { Camera } from "lucide-react";

export default function GuideComment() {
  return (
    <span className="flex items-center gap-1.75 text-xs font-semibold px-4 py-2 mt-0.5 rounded-full bg-teal-wash text-teal">
      <Camera width={15} height={15} />폰 카메라로 QR을 스캔해 주세요
    </span>
  );
}
