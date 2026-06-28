import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocaleProvider } from "@/context/LocaleContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Krausen — Recetas de cerveza artesanal",
  description: "Comunidad para compartir, descubrir y versionar recetas de cerveza artesanal.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();

  return (
    <html lang="es">
      <body className={`${lora.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased flex flex-col min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
            <AuthProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </AuthProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}