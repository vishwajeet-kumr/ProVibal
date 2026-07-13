// app/layout.tsx — Root layout, Clerk provider, global fonts, metadata

import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Provibal — AI Prompt Kit Generator",
    template: "%s | Provibal",
  },
  description:
    "Generate production-grade vibe coding prompts instantly. Get a complete foundation prompt, file map, and build sequence for any app — ready to paste into any AI IDE.",
  keywords: [
    "vibe coding",
    "AI prompts",
    "prompt engineering",
    "AI IDE",
    "Cursor prompts",
    "Next.js",
    "prompt generator",
  ],
  authors: [{ name: "Provibal" }],
  creator: "Provibal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://provibal.dev",
    siteName: "Provibal",
    title: "Provibal — AI Prompt Kit Generator",
    description: "Generate production-grade vibe coding prompts instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Provibal — AI Prompt Kit Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Provibal — AI Prompt Kit Generator",
    description: "Generate production-grade vibe coding prompts instantly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable} h-full antialiased`}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
    (function() {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.toggle('dark', 
        theme === 'dark');
    })();
  `
            }}
          />
        </head>
        <body className="bg-[var(--bg)]">
          <Navbar />
          {children}
          <Toaster position="bottom-right" richColors />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
