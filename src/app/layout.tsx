import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "@/components/ui/Toaster";
import { GlobalFormListener } from "@/components/GlobalFormListener";

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
};

export const runtime = "edge";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${bebasNeue.variable} ${inter.variable} antialiased bg-background text-foreground`}
        >
          <ToastProvider>
            {children}
            <Toaster />
            <GlobalFormListener />
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
