import type { Metadata } from "next";
import { Geist, Geist_Mono, Pathway_Gothic_One } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pathwayGothicOne = Pathway_Gothic_One({
  weight: "400",
  variable: "--font-pathway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JMEM Wiler | Jugend mit einer Mission",
  description:
    "Jugend mit einer Mission (JMEM / YWAM) Wiler bei Seedorf, Schweiz. Schulen, Einsätze, Seminare und mehr. passion - training - mission.",
  keywords: [
    "JMEM",
    "YWAM",
    "Wiler",
    "Jugend mit einer Mission",
    "DTS",
    "Missionsschule",
    "Schweiz",
  ],
  openGraph: {
    title: "JMEM Wiler | Jugend mit einer Mission",
    description: "passion - training - mission",
    url: "https://jmemwiler.ch",
    siteName: "JMEM Wiler",
    locale: "de_CH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${pathwayGothicOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
