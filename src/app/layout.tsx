import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nWrapper } from "../components/i18n-wrapper";
import { defaultLocale, locales } from "../locales";
import "../styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });

export const metadata: Metadata = {
  title: "Linux Game",
  description: locales[defaultLocale].translations.metadata.description as string,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}>
        <I18nWrapper>{children}</I18nWrapper>
      </body>
    </html>
  );
}
