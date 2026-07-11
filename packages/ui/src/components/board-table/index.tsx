import BoardTableContent from "./BoardTableContent";
import { BoardTableContext } from "./BoardTableContext";
import { BoardTableFooter } from "./BoardTableFooter";
import BoardTableHeader from "./BoardTableHeader";
import BoardTableLayout from "./BoardTableLayout";
import BoardTableLeftLayout from "./BoardTableLeftLayout";
import BoardTableMetaInfo from "./BoardTableMetaInfo";
import BoardTableProvider from "./BoardTableProvider";
import BoardTableRightLayout from "./BoardTableRightLayout";
import BoardTableSection from "./BoardTableSection";
import BoardTableSuccessBadge from "./BoardTableSuccessBadge";
import BoardTableSuccessContent from "./BoardTableSuccessContent";
import BoardTableTitle from "./BoardTableTitle";

export const BoardTable = {
  Provider: BoardTableProvider,
  Layout: BoardTableLayout,
  Header: BoardTableHeader,
  Content: BoardTableContent,
  Footer: BoardTableFooter,
  MetaInfo: BoardTableMetaInfo,
  Title: BoardTableTitle,
  Section: BoardTableSection,
  LeftLayout: BoardTableLeftLayout,
  RightLayout: BoardTableRightLayout,
  SuccessBadge: BoardTableSuccessBadge,
  SuccessContent: BoardTableSuccessContent,
  Context: BoardTableContext,
};
