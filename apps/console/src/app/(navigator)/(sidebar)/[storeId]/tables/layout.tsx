import MainLayout from "../../components/MainLayout";

export default function TablesSettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
