import TextLogo from "@ssurak/ui/components/TextLogo";
import { ToggleTheme } from "@ssurak/ui/components/theme/ToggleTheme";
import Link from "next/link";

export default function NavigatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="antialiased">
      <header className="sticky top-0 bg-background z-20 flex justify-between px-6 items-center w-screen h-14">
        <Link href="/" className="font-bold text-lg">
          <TextLogo />
        </Link>
        <div className="flex flex-row items-center gap-4">
          <ToggleTheme />
        </div>
      </header>
      {children}
    </section>
  );
}
