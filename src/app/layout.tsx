import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "Precision FC — futsal club founded in 2019, playing out of Rumble Futsal in Kathmandu.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Precision FC — Futsal Club, Kathmandu",
    template: "%s — Precision FC",
  },
  description: DEFAULT_DESCRIPTION,
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    siteName: "Precision FC",
    title: "Precision FC — Futsal Club, Kathmandu",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/crest.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precision FC — Futsal Club, Kathmandu",
    description: DEFAULT_DESCRIPTION,
    images: ["/crest.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
