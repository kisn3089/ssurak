import ServerPrefetch from "@/app/(navigator)/components/ServerPrefetch";
import SectionLayout from "../../components/SectionLayout";

const description =
  "테이블을 추가하여 주문을 받을 수 있습니다. 테이블은 매장 내 좌석을 의미하며, 각 테이블마다 주문을 구분할 수 있습니다.";

export default async function AddTableLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}>) {
  const { storeId } = await params;

  return (
    <SectionLayout title="테이블 추가" description={description}>
      <ServerPrefetch url={`/stores/v1/${storeId}/tables`}>
        {children}
      </ServerPrefetch>
    </SectionLayout>
  );
}
