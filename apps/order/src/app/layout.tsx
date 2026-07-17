import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@ssurak/ui/globals.css";
import TanstackProvider from "@ssurak/api/core/TanstackProvider";
import { NextThemeProviders } from "@ssurak/ui/components/theme/ThemeProviders";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "주문 서비스 - ssurak",
  description: "고객이 주문하는 애플리케이션 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-dvh`}
      >
        <NextThemeProviders
          options={{
            position: "top-center",
            mobileOffset: { left: "60px", right: "60px" },
            richColors: true,
            visibleToasts: 10,
          }}
        >
          <TanstackProvider>
            <div className="mx-auto min-h-dvh max-w-2xl">{children}</div>
          </TanstackProvider>
        </NextThemeProviders>
      </body>
    </html>
  );
}
