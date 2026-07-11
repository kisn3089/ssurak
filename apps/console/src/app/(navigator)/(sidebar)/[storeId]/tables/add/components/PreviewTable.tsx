type PreviewTableProps = {
  children: React.ReactNode;
};
export default function PreviewTable({ children }: PreviewTableProps) {
  return (
    <div className="flex flex-col w-full @3xl:max-w-100 @3xl:sticky @3xl:top-[56px] @3xl:h-fit">
      <div>
        <h2 className="text-2xl font-bold mb-1.5">추가될 테이블 미리 확인</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          추가될 테이블의 형태를 미리 확인해보세요. 값을 변경하여 최종 원하는
          형태로 설정할 수 있습니다.
        </p>
        {children}
      </div>
    </div>
  );
}
