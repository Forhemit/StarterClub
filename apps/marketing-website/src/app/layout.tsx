import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Bebas_Neue,
  Inter,
  Syne,
} from "next/font/google";
import "./globals.css";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "@/components/ui/Toaster";
import { GlobalFormListener } from "@/components/GlobalFormListener";
import { EnvironmentBanner, ThemeProvider } from "@starter-club/ui";

// Primary body font - clean, professional, highly legible
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Headline font - distinctive, modern, brand personality
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

// Racetrack mode font - kept for locked legacy theme
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Starter Club SF - Coming Soon",
  description: "San Francisco is Done Waiting. It's Time to Start. A workshop for founders, creators, and organizers.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${syne.variable} ${bebasNeue.variable} antialiased bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark", "racetrack"]}
          >
            <EnvironmentBanner />
            <ToastProvider>
              {children}
              <Toaster />
              <GlobalFormListener />
            </ToastProvider>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
