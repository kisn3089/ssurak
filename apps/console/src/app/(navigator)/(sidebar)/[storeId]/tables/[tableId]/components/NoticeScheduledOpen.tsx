"use client";

export default function NoticeScheduledOpen({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  return (
    <div className="p-12">
      <h1 className="font-bold text-2xl">{title}</h1>
      <div className="grid place-content-center min-h-96 font-semibold text-lg text-center">
        <span>현재 서비스 준비 중입니다.</span>
        <span>{content}</span>
      </div>
    </div>
  );
}
