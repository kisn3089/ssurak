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
import {
  activatePrefix,
  ToggleActivateParams,
  useTableActionsContext,
} from "./TableActionsProvider";
import Link from "next/link";
import { Button } from "@ssurak/ui/components/buttons/button";

interface TableActionsProps {
  tableForAction: ToggleActivateParams;
}

export default function TableActions({ tableForAction }: TableActionsProps) {
  const { publicId, isActive, tableNumber } = tableForAction;
  const { toggleActivateOnBackground, deleteTableOnBackground } =
    useTableActionsContext();

  const activateIcon = isActive ? <RadioOffIcon /> : <RadioIcon />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon-sm"}
          aria-label="테이블 작업 메뉴"
        >
          <Ellipsis width={18} className="cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => toggleActivateOnBackground(tableForAction)}
        >
          {activateIcon}
          {`${activatePrefix(isActive)}활성화`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`tables/${publicId}/edit`}>
            <SquarePen />
            수정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => deleteTableOnBackground({ publicId, tableNumber })}
          variant="destructive"
        >
          <Trash2Icon />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
