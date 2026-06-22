import {
  PublicOrderWithItem,
  PublicSession,
  PublicTable,
} from "./publicModel.type";

export type BoardSessionWithOrders<
  Option extends "Narrow" | "Wide" = "Narrow",
> = Pick<PublicSession, "publicId" | "expiresAt"> & {
  orders: PublicOrderWithItem<Option>[];
};

export type BoardTableWithSessions<
  Option extends "Narrow" | "Wide" = "Narrow",
> = PublicTable & {
  tableSessions?: BoardSessionWithOrders<Option>[];
};

export type OrderBoardByStore<Option extends "Narrow" | "Wide" = "Narrow"> =
  BoardTableWithSessions<Option>[];
