// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Syne: geometric, premium feel — used for headings and UI labels
// JetBrains Mono: for scores, stats, and live data readouts
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "CricVision AI — Real-time Cricket Analytics",
    template: "%s · CricVision AI",
  },
  description:
    "Live match analytics, ML-powered win probability, and AI-driven insights for every ball, every over, every match.",
  keywords: ["cricket", "analytics", "IPL", "live scores", "win probability", "AI"],
  authors: [{ name: "CricVision" }],
  openGraph: {
    title: "CricVision AI",
    description: "Real-time cricket analytics powered by ML and AI.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CricVision AI",
    description: "Live cricket analytics. Ball by ball.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Force dark — CricVision is dark-only. Remove className if you
      // want to support a light theme later and handle it via next-themes.
      className={`dark ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Preconnect to Supabase so the first auth check is fast.
         * Replace the URL with your actual Supabase project URL.
         */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {/*
         * ReactQueryProvider wraps Supabase so React Query can
         * be used anywhere in the tree, including auth-dependent components.
         */}
        <ReactQueryProvider>
          <SupabaseProvider>
            {children}
            {/*
             * Toaster lives here so toast notifications work on every
             * page — auth errors, live match alerts, save confirmations.
             */}
            <Toaster />
          </SupabaseProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}