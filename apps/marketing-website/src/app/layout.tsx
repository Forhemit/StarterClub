import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Bebas_Neue,
  Inter,
  Syne,
  Space_Mono,
  Chakra_Petch,
  Orbitron,
  DM_Serif_Display,
  JetBrains_Mono,
  Fira_Code,
} from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "@/components/ui/Toaster";
import { GlobalFormListener } from "@/components/GlobalFormListener";
import { EnvironmentBanner, ThemeProvider } from "@starter-club/ui";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Careers Page Fonts - Corporate Theme
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Careers Page Fonts - Racing Theme
const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
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
          className={`${bebasNeue.variable} ${inter.variable} ${syne.variable} ${spaceMono.variable} ${chakraPetch.variable} ${dmSerifDisplay.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${firaCode.variable} antialiased bg-background text-foreground`}
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
