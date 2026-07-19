import { Table } from "@ssurak/api/types/table/table.interface";
import useQueryParams from "./useQueryParams";

export default function useFilterTableList(tableList: Table[]) {
  const { getParams } = useQueryParams();

  const sectionFilter = getParams("section");
  const floorFilter = getParams("floor");

  const filteredTableList = tableList.filter((table) => {
    const sectionMatch = sectionFilter ? table.section === sectionFilter : true;
    const floorMatch = floorFilter
      ? table.floor === parseInt(floorFilter)
      : true;
    return sectionMatch && floorMatch;
  });

  return filteredTableList;
}
