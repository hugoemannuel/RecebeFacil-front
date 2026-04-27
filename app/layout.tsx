import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecebeFácil | Automatize suas cobranças via WhatsApp",
  description: "Receba seus clientes automaticamente pelo WhatsApp, sem constrangimento e sem esquecer cobranças. A plataforma número 1 para pequenos negócios reduzirem a inadimplência.",
  keywords: ["cobrança automática", "cobrança pelo whatsapp", "sistema de cobrança", "receber pix", "inadimplência", "pequenos negócios", "barbeiro", "freelancer", "recebefácil"],
  authors: [{ name: "RecebeFácil" }],
  openGraph: {
    title: "RecebeFácil | Receba automaticamente no WhatsApp",
    description: "Sua máquina de recebimentos configurada em 3 minutos. Reduza a inadimplência em até 40% no primeiro mês.",
    url: "https://recebefacil.com.br",
    siteName: "RecebeFácil",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dashboard do RecebeFácil no WhatsApp",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecebeFácil | Automatize suas cobranças",
    description: "Pare de esquecer cobranças e de perder dinheiro. Mensagens inteligentes que trabalham por você.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
