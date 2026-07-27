import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ThemeScript } from "@damc/ui";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DAMC Admin",
    template: "%s | DAMC Admin",
  },
  description: "Content and membership management for the Dignified Articulate Men's Club website.",
  robots: { index: false, follow: false },
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
      <body className="font-sans">{children}</body>
    </html>
  );
}
