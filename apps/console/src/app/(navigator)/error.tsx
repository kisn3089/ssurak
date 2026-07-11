"use client";

import ErrorFallback from "@/app/(navigator)/components/ErrorFallback";

export default function NavigatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} resetErrorBoundary={reset} />;
}
