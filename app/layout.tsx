import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import { IntroTooltip } from "@/components/IntroTooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Størrémon - Compare Pokémon & Museum Artifacts by Size",
  description:
    "Discover surprising size similarities between Pokémon and classical museum artifacts. Interactive comparison tool with real data from PokéAPI and The Met Museum.",
  keywords: [
    "pokemon",
    "museum",
    "art",
    "comparison",
    "size",
    "interactive",
    "education",
  ],
  authors: [{ name: "Størrémon Team" }],
  creator: "Størrémon",
  publisher: "Størrémon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://storremon.strm.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Størrémon - Compare Pokémon & Museum Artifacts by Size",
    description:
      "Discover surprising size similarities between Pokémon and classical museum artifacts. Interactive comparison tool with real data.",
    url: "https://storremon.strm.dev",
    siteName: "Størrémon",
    images: [
      {
        url: "/storremon-cover.png",
        width: 1344,
        height: 768,
        alt: "Størrémon - Pokémon vs Museum Art comparison",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Størrémon - Compare Pokémon & Museum Artifacts by Size",
    description:
      "Discover surprising size similarities between Pokémon and classical museum artifacts.",
    images: ["/storremon-cover.png"],
    creator: "@storremon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased relative`}
      >
        <Analytics />
        <Background />
        <Providers>
          <div className="relative flex min-h-screen flex-col z-20">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <IntroTooltip />
        </Providers>
      </body>
    </html>
  );
}
