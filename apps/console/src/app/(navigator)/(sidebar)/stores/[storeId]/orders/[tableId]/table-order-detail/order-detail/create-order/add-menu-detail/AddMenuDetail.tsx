import { MenuDetail } from "@spaceorder/ui/components/menu/menu-detail";
import { useCreateOrderContext } from "../CreateOrderProvider";
import AddMenuButton from "./AddMenuButton";
import { Card, CardHeader } from "@spaceorder/ui/components/layouts/card";
import AddedMenuList from "./added-menu-list/AddedMenuList";
import CreateOrderButton, {
  CloseDialogProps,
} from "./added-menu-list/CreateOrderButton";

export default function AddMenuDetail({ closeDialog }: CloseDialogProps) {
  const {
    state: { selectedMenu },
  } = useCreateOrderContext();

  if (!selectedMenu) {
    return (
      <AddMenuDetailLayout
        title={<CreateOrderTitle />}
        button={<CreateOrderButton closeDialog={closeDialog} />}
      >
        <AddedMenuList />
      </AddMenuDetailLayout>
    );
  }

  return (
    <MenuDetail.Provider menu={selectedMenu} key={selectedMenu.publicId}>
      <AddMenuDetailLayout
        title={<MenuDetail.Info />}
        button={<AddMenuButton />}
      >
        <MenuDetail.RequiredOptions />
        <MenuDetail.CustomOptions />
      </AddMenuDetailLayout>
    </MenuDetail.Provider>
  );
}

function CreateOrderTitle() {
  return <h3 className="font-bold text-xl px-2">추가한 주문</h3>;
}

type AddMenuDetailLayoutProps = {
  children: React.ReactNode;
  button: React.ReactNode;
  title: React.ReactNode;
};

function AddMenuDetailLayout({
  children,
  button,
  title,
}: AddMenuDetailLayoutProps) {
  return (
    <Card className="min-w-[360px] h-full flex flex-col justify-between bg-background rounded-3xl shadow-md  overflow-hidden">
      <div className="overflow-y-scroll scrollbar-hide">
        <CardHeader className="p-3">{title}</CardHeader>
        {children}
      </div>
      {button}
    </Card>
  );
}
