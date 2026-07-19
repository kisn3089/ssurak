import { Badge } from "@ssurak/ui/components/forms/badge";

export const activatePrefix = (isActive: boolean) => (isActive ? "비" : "");

export const activeBadge = {
  active: (
    <Badge variant={"active"} className="text-xs">
      활성화
    </Badge>
  ),
  inactive: (
    <Badge variant={"inactive"} className="text-xs">
      비활성화
    </Badge>
  ),
};
