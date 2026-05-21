/**
 * MenuDetail Compound Component
 *
 * 사용 예시:
 * <MenuDetail.Provider menu={menu}>
 *   <MenuDetail.Info>
 *     <MenuDetail.Counter />
 *   </MenuDetail.Info>
 *   <MenuDetail.RequiredOptions />
 *   <MenuDetail.CustomOptions />
 *   <MenuDetail.AddCart />
 * </MenuDetail.Provider>
 */

import { MenuDetailProvider } from "./MenuDetailProvider";
import { MenuDetailCounter } from "./MenuDetailCounter";
import { MenuDetailRequiredOptions } from "./MenuDetailRequiredOptions";
import { MenuDetailCustomOptions } from "./MenuDetailCustomOptions";
import { MenuDetailContext } from "./MenuDetailContext";
import MenuDetailInfo from "./MenuDetailInfo";
import MenuDetailAddCart from "./MenuDetailAddCart";

export const MenuDetail = {
  Provider: MenuDetailProvider,
  Info: MenuDetailInfo,
  Counter: MenuDetailCounter,
  RequiredOptions: MenuDetailRequiredOptions,
  CustomOptions: MenuDetailCustomOptions,
  AddCart: MenuDetailAddCart,
  Context: MenuDetailContext,
};

export type { SelectedOptions } from "./MenuDetailContext";
