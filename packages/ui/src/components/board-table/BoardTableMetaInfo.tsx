import { Armchair, Layers2 } from "lucide-react";
import { useBoardTableContext } from "./BoardTableContext";
import CountIcon from "../CountIcon";

const sortedIcons = [
  <Layers2 key={"floor"} width={20} />,
  <Armchair key={"seats"} width={22} />,
];

export default function BoardTableMetaInfo() {
  const { floor, seats } = useBoardTableContext("BoardTableMetaInfo");
  return (
    <>
      {[floor, seats].map(
        (value, index) =>
          value && (
            <div
              key={index}
              className={`${value ? "visible" : "invisible"} relative mr-1`}
            >
              {sortedIcons[index]}
              {value && (
                <CountIcon
                  count={value}
                  className="-bottom-1 -right-1.5 text-[0.6rem]"
                />
              )}
            </div>
          )
      )}
    </>
  );
}
