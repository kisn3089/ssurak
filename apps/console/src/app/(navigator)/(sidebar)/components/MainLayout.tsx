export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="pt-4 pl-4 pr-6">{children}</div>;
}
