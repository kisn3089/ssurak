export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="antialiased h-full flex gap-2 pr-6 pb-4">
      {children}
    </section>
  );
}
