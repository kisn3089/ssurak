export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-2xl md:max-w-5xl pt-8 px-6">{children}</div>
  );
}
