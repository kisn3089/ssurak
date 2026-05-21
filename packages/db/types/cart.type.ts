import { PublicOrderItem } from "./publicModel.type";

export type PublicCartItem = Omit<PublicOrderItem, "publicId" | "createdAt"> & {
  id: string;
  menuPublicId: string;
  requiredOptions?: Record<string, string>;
  customOptions?: Record<string, string>;
  addedAt: string;
};

export type Cart = {
  sessionToken: string;
  menus: PublicCartItem[];
  updatedAt: string;
};
