import type { Metadata } from "next";
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

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
        {/* Desktop-only gate */}
        <ClientProviders>
          <div className="hidden md:block">{children}</div>
        </ClientProviders>
        <div className="flex md:hidden h-screen flex-col items-center justify-center gap-4 px-8 text-center bg-white">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#285e50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          <p className="text-[20px] text-[#09090b]" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
            Desktop only
          </p>
          <p className="text-[14px] text-[#747474] leading-[1.6] max-w-[260px]">
            This prototype is designed for desktop. Please open it on a larger screen.
          </p>
        </div>
      </body>
    </html>
  );
}
