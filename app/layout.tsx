import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Superando Limites | Desafio da Japa",
    template: "%s | Superando Limites",
  },
  description:
    "Registre a conclusao dos desafios virtuais do Desafio da Japa / Superando Limites.",
  icons: {
    icon: "https://assets.zyrosite.com/jGNC2Ddl2JvsPJ0n/boneca-lNpHd0LlM5m34B8T.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
