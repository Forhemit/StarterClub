import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@starter-club/ui/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Third Space | Forhemit",
  description: "Building climate-resilient community infrastructure through EV charging networks integrated with local businesses.",
  keywords: ["EV charging", "climate resilience", "community infrastructure", "Forhemit"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
              {/* Header Navigation */}
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-brand-gradient">
                        Forhemit
                      </span>
                      <span className="hidden sm:inline-block text-sm text-muted-foreground">
                        Third Space
                      </span>
                    </a>
                  </div>

                  <nav className="ml-auto flex items-center gap-6">
                    <a
                      href="/"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Home
                    </a>
                    <a
                      href="/about"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      About
                    </a>
                    <a
                      href="/contact"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Contact
                    </a>

                    {/* Auth components will be added here */}
                    <div className="flex items-center gap-2">
                      <div id="auth-buttons"></div>
                    </div>
                  </nav>
                </div>
              </header>

              {/* Main Content */}
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>

              {/* Footer */}
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by <a href="https://forhemit.com" className="font-medium underline underline-offset-4">Forhemit</a>.
                    Part of the <a href="https://starterclub.com" className="font-medium underline underline-offset-4">Starter Club</a> monorepo.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
