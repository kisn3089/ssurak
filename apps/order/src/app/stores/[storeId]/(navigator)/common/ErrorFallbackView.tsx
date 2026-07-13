import { Button } from "@ssurak/ui/components/buttons/button";
import { isAxiosError } from "axios";
import { CircleAlert } from "lucide-react";
import SessionExpiredError from "../../components/SessionExpiredError";

type ErrorFallbackViewProps = {
  error: Error | unknown;
  errorTitle: string;
  reset?: () => void;
  children?: React.ReactNode;
};

export default function ErrorFallbackView({
  error,
  errorTitle,
  children,
  reset,
}: ErrorFallbackViewProps) {
  if (isAxiosError(error) && error.response?.status === 401) {
    return <SessionExpiredError />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center break-keep">
      <CircleAlert className="w-16 h-16 text-destructive mb-4" />
      <h1 className="md:text-lg font-bold">{errorTitle}</h1>
      {children && <div className="mt-4">{children}</div>}
      {reset && (
        <Button onClick={reset} className="font-semibold mt-4">
          다시 시도하기
        </Button>
      )}
    </div>
  );
}
