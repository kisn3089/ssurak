import { Spinner } from "@spaceorder/ui/components/spinner";

export default function MenusLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Spinner className="w-6 h-8" />
    </div>
  );
}
