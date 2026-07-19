"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ssurak/ui/components/forms/dropdown-menu";
import {
  Ellipsis,
  RadioIcon,
  RadioOffIcon,
  SquarePen,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ssurak/ui/components/buttons/button";
import {
  ToggleTableActivateParams,
  useTableActionsContext,
} from "./useTableActionsContext";
import { activatePrefix } from "./activate-badge.const";

interface TableActionsProps {
  metaInfoForAction: ToggleTableActivateParams;
  editHref: string;
}

export default function TableActions({
  metaInfoForAction,
  editHref,
}: TableActionsProps) {
  const { publicId, isActive, name } = metaInfoForAction;
  const { toggleActivateOnBackground, deleteTableOnBackground } =
    useTableActionsContext();

  const activateIcon = isActive ? <RadioOffIcon /> : <RadioIcon />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon-sm"} aria-label="작업 메뉴">
          <Ellipsis width={18} className="cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => toggleActivateOnBackground(metaInfoForAction)}
        >
          {activateIcon}
          {`${activatePrefix(isActive)}활성화`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={editHref}>
            <SquarePen />
            수정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => deleteTableOnBackground({ publicId, name })}
          variant="destructive"
        >
          <Trash2Icon />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
