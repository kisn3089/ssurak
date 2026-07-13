"use client";

import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import { Owner } from "@ssurak/api/types/owner/owner.interface";

export default function UserName() {
  const { data } = useSuspenseWithAuth<Owner>(`/identity/v1/me`);

  return <span className="w-full text-center">{data.name}</span>;
}
