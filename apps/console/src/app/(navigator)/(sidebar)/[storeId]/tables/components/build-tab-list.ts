import { Table } from "@ssurak/api/types/table/table.interface";

export default function buildTableTabList(tableList: Table[]) {
  const sectionList = new Set<string>();
  const floorList = new Set<number>();

  tableList.forEach((table) => {
    const { floor, section } = table;
    if (section) sectionList.add(section);
    if (floor !== null) floorList.add(floor);
  });

  const tabs = {
    section: Array.from(sectionList).map((section) => ({
      label: section,
      id: section,
    })),
    floor: Array.from(floorList).map((floor) => ({
      label: `${floor}층`,
      id: floor.toString(),
    })),
  };

  return tabs;
}
