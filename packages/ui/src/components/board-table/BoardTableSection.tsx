import { CardDescription } from "../layouts/card";
import { useBoardTableContext } from "./BoardTableContext";

export default function BoardTableSection() {
  const { section } = useBoardTableContext("BoardTableSection");

  return <CardDescription className="text-sm">{section}</CardDescription>;
}
