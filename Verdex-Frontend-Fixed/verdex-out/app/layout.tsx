import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: "%s | VERDEX Legal Co-Pilot",
    default: "VERDEX | AI-Powered Legal Co-Pilot",
  },
  description: "AI-powered legal assistance for every citizen. Bringing clarity, protection, and understanding to those who need it most.",
  keywords: ["Legal Tech", "AI Legal Assistant", "Law", "Verdex"],
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable,
          playfair.variable
        )}
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}