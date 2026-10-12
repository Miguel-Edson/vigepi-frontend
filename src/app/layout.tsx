import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";


const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "VIGEPI",
  description: "Sistema de monitoramento de sífilis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}>
        {/* Conteúdo dinâmico das páginas */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}