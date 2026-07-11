import { CardTitle } from "../layouts/card";
import { useBoardTableContext } from "./BoardTableContext";

export default function BoardTableTitle() {
  const { tableNumber } = useBoardTableContext("BoardTableTitle");

  return <CardTitle className="text-xl">{tableNumber}</CardTitle>;
}
