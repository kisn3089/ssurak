import MainLayout from "../components/MainLayout";

export default function MenusSettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
