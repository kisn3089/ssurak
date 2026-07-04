/**
 * TableOrderCard Compound Component
 *
 * 사용 예시:
 *   <TableOrderCard.Card>
 *     <TableOrderCard.Header />
 *     <TableOrderCard.Content>
 *       <TableOrderCard.AcceptAllButton />
 *       <TableOrderCard.OrderList />
 *     </TableOrderCard.Content>
 *     <TableOrderCard.Footer />
 *   </TableOrderCard.Card>
 */

import { TableOrderCard as Card } from "./TableOrderCard";
import { TableOrderHeader } from "./TableOrderHeader";
import { TableOrderContent } from "./TableOrderContent";
import { TableOrderFooter } from "./TableOrderFooter";
import { TableOrderOrderList } from "./TableOrderOrderList";
import { TableOrderItem } from "./TableOrderItem";
import { TableOrderAcceptAllButton } from "./TableOrderAcceptAllButton";

export const TableOrderCard = {
  Card,
  Header: TableOrderHeader,
  Content: TableOrderContent,
  Footer: TableOrderFooter,
  OrderList: TableOrderOrderList,
  Item: TableOrderItem,
  AcceptAllButton: TableOrderAcceptAllButton,
};
