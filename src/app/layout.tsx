import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";
import { siteDescription, siteTitle, siteUrl } from "@/content/siteContent";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Flávia Figueredo",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Flávia Figueredo",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      {/* extensões de navegador (como o ColorZilla) adicionam atributos no body antes do React carregar; isso ignora só essa diferença no próprio body */}
      <body
        className={`${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
