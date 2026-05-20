"use client";

import { use } from "react";
import { Spinner } from "@spaceorder/ui/components/spinner";
import useCreateSessionEffect from "./hooks/useCreateSessionEffect";

export default function CreateSessionPage({
  params,
}: {
  params: Promise<{ qrCode: string }>;
}) {
  const { qrCode } = use(params);
  useCreateSessionEffect(qrCode);

  return (
    <section className="min-h-[calc(100vh-4rem)] grid place-content-center">
      <Spinner className="w-6 h-6" />
    </section>
  );
}
