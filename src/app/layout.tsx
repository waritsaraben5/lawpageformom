import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TextResizer } from "@/components/accessibility/TextResizer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A2240" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1E33" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} font-sans antialiased`}>
        <AppProviders>
          <SkipLink />
          <Header />
          <main id="main-content" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <TextResizer />
        </AppProviders>
      </body>
    </html>
  );
}
