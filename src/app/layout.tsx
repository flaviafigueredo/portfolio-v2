import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "flavia@portfolio:~$",
  description: "Flávia Figueredo, desenvolvedora front-end em Porto Alegre. Interfaces rápidas e responsivas, automações, integrações e dados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      {/* extensões de navegador (como o ColorZilla) adicionam atributos no body antes do React carregar; isso ignora só essa diferença no próprio body */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
