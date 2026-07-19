import {
  CreateMenuPayload,
  UpdateMenuPayload,
} from "../../../schemas/model/menu.schema";
import { http } from "../../axios/http";

function prefix(storeId: string) {
  return `/stores/v1/${storeId}/menus`;
}

export type CreateMenuParams = {
  storeId: string;
  createMenuPayload: CreateMenuPayload;
};
async function createMenu({ storeId, createMenuPayload }: CreateMenuParams) {
  const response = await http.post(prefix(storeId), createMenuPayload);

  return response.data;
}

export type UpdateMenuParams = {
  storeId: string;
  menuId: string;
  updateMenuPayload: UpdateMenuPayload;
};
async function updateMenu({
  storeId,
  menuId,
  updateMenuPayload,
}: UpdateMenuParams) {
  const response = await http.patch(
    `${prefix(storeId)}/${menuId}`,
    updateMenuPayload
  );
  return response.data;
}

export type DeleteMenuParams = {
  storeId: string;
  menuId: string;
};
async function deleteMenu({ storeId, menuId }: DeleteMenuParams) {
  await http.delete(`${prefix(storeId)}/${menuId}`);
}

export const httpMenus = {
  createMenu,
  updateMenu,
  deleteMenu,
};
