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
 * </MenuDetail.Provider>
 */

import { MenuDetailProvider } from "./MenuDetailProvider";
import { MenuDetailRequiredOptions } from "./MenuDetailRequiredOptions";
import { MenuDetailCustomOptions } from "./MenuDetailCustomOptions";
import { MenuDetailContext } from "./MenuDetailContext";
import MenuDetailInfo from "./MenuDetailInfo";

export const MenuDetail = {
  Provider: MenuDetailProvider,
  Info: MenuDetailInfo,
  RequiredOptions: MenuDetailRequiredOptions,
  CustomOptions: MenuDetailCustomOptions,
  Context: MenuDetailContext,
};
