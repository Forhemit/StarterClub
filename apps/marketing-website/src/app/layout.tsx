import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "@/components/ui/Toaster";
import { GlobalFormListener } from "@/components/GlobalFormListener";
import { EnvironmentBanner } from "@starter-club/ui";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Starter Club SF - Coming Soon",
  description: "San Francisco is Done Waiting. It’s Time to Start. A workshop for founders, creators, and organizers.",
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
          className={`${bebasNeue.variable} ${inter.variable} antialiased bg-background text-foreground`}
        >
          <EnvironmentBanner />
          <ToastProvider>
            {children}
            <Toaster />
            <GlobalFormListener />
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
