import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StadiumIQ AI - FIFA World Cup 2026 Smart Stadium & Operations",
  description: "GenAI-powered intelligent assistant optimizing FIFA World Cup 2026 stadium operations and fan experience.",
  keywords: ["FIFA", "World Cup 2026", "Smart Stadium", "Crowd Intelligence", "AI Assistant", "Stadium Navigation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
