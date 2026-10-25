import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { CartFlightProvider } from "@/components/motion/CartFlightContext";
import { Preloader } from "@/components/motion/Preloader";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { PageTransition } from "@/components/motion/PageTransition";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GROCIFY — Curated Everyday Goods for Mindful Living",
  description:
    "India-focused curated marketplace for genuinely useful, eco-conscious everyday products. Thoughtfully crafted essentials with transparent verified credentials under ₹1,000.",
  keywords: [
    "grocify",
    "eco conscious",
    "sustainable everyday goods",
    "curated essentials",
    "india marketplace",
  ],
  authors: [{ name: "HOW Networks" }],
  openGraph: {
    title: "GROCIFY — Curated Everyday Goods",
    description: "Curated marketplace for eco-conscious everyday goods in India.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#173D2D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body bg-warm-ivory text-soft-ink antialiased selection:bg-electric-citrus selection:text-deep-forest relative">
        <div className="grain-overlay" aria-hidden="true" />
        <Preloader />
        <CustomCursor />
        <LenisProvider>
          <CartProvider>
            <CartFlightProvider>
              <PageTransition>{children}</PageTransition>
            </CartFlightProvider>
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
