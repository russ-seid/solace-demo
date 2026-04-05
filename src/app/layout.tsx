import type { Metadata } from "next";
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

const mollieGlaston = localFont({
  src: "./fonts/MollieGlaston.ttf",
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Solace",
  description: "Solace — Patient Advocacy Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${mollieGlaston.variable}`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-lato)] bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
