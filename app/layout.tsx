import type { Metadata } from "next";
import { Cormorant_Garamond, Fredoka, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playful = Fredoka({
  variable: "--font-playful",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Happy Birthday 🎂",
  description: "A little birthday surprise.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${playful.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
