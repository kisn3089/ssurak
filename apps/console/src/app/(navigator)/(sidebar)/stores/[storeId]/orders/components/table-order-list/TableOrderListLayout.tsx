export default function TableBoardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div
      className={`w-full h-full grid auto-rows-fr gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5`}
    >
      {children}
    </div>
  );
}
