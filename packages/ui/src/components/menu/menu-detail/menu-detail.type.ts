interface Option {
  key: string;
  price: number;
}

interface MenuOption {
  defaultKey: string;
  options: Option[];
}

export interface Menu {
  publicId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  isAvailable: boolean;
  requiredOptions: Record<string, MenuOption> | null;
  customOptions: Record<string, MenuOption> | null;
  quantity?: number;
}

export interface MenuOptionEntry {
  key: string;
  optionInfo: MenuOption;
}

export interface MenuDetailProviderProps {
  menu: Menu;
  children: React.ReactNode;
}

export type SelectedOptions = {
  required: Map<string, string>;
  custom: Map<string, string>;
};

export type SnapshotToFetch = () => {
  menuPublicId: string;
  quantity: number;
  menuName: string;
  price: number;
  requiredOptions?: Record<string, string> | undefined;
  customOptions?: Record<string, string> | undefined;
};

export type SelectOption = (groupKey: string, optionKey: string) => void;
