"use client";

import useSuspenseWithAuth from "@spaceorder/api/hooks/useSuspenseWithAuth";
import { PublicOwner } from "@spaceorder/db/types";

export default function UserName() {
  const { data } = useSuspenseWithAuth<PublicOwner>(`/identity/v1/me`);

  return <span className="w-full text-center">{data.name}</span>;
}
