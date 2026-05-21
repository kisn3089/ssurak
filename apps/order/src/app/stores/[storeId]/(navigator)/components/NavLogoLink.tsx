"use client";

import Link from "next/link";
import Image from "next/image";
import StoreName from "./StoreName";
import { useParams } from "next/dist/client/components/navigation";

export default function NavLogoLink() {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Link href={`/stores/${storeId}`}>
      <div className="flex items-center gap-x-2 min-w-0">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={20}
          height={20}
          className="shrink-0"
        />
        <StoreName />
      </div>
    </Link>
  );
}
