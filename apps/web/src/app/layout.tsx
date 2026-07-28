import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ThemeScript } from "@damc/ui";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { HeroLogoProvider } from "@/components/hero-logo-context";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.damcng.com"),
  title: {
    default: "Dignified Articulate Men's Club (DAMC)",
    template: "%s | DAMC",
  },
  description:
    "DAMC is a non-profit private membership club in Lagos fostering unity, wealth creation and social good among dignified, articulate men.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Dignified Articulate Men's Club",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <HeroLogoProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
        </HeroLogoProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
