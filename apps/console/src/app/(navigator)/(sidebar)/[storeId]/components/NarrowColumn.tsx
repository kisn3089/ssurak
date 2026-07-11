type NarrowColumnProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export default function NarrowColumn({
  children,
  title,
  description,
}: Readonly<NarrowColumnProps>) {
  return (
    <section className="flex flex-col self-center mt-2">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-neutral-600 dark:text-neutral-400 mb-10">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
