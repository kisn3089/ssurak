import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@ssurak/ui/components/animate-ui/components/tabs";
import useQueryParams from "../../../hooks/useQueryParams";
import FilterLayout from "./FilterLayout";

type TabInfo = { label: string; id: string };
type FilterTabsProps = {
  tabs: Record<string, TabInfo[]>;
};

export default function FilterTabs({ tabs }: FilterTabsProps) {
  const { getParams, addParams } = useQueryParams();

  return (
    <FilterLayout>
      {Object.entries(tabs).map(([tabName, tabList]) => (
        <Tabs
          key={tabName}
          value={getParams(tabName)}
          onValueChange={(value) => addParams(tabName, value)}
        >
          <TabsList>
            {tabList.map((tab, i) => (
              <TabsTrigger key={`${tab.id}-${i}`} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ))}
    </FilterLayout>
  );
}
