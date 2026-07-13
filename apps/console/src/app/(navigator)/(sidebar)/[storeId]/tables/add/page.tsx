import Link from "next/link";
import AddTableForm from "./components/AddTableForm";
import { Button } from "@ssurak/ui/components/buttons/button";

type AddTablePageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function AddTablePage({ params }: AddTablePageProps) {
  const { storeId } = await params;

  return (
    <AddTableForm>
      <Link href={`/${storeId}/tables`}>
        <Button variant={"outline"}>취소</Button>
      </Link>
    </AddTableForm>
  );
}
