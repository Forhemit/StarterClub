import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-brand-gradient mb-6">
          Third Space Charging
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Building climate-resilient community infrastructure through a network
          of EV charging stations integrated with local businesses.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Migration Status Banner */}
      <div className="mt-16 p-6 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">🚧 Migration in Progress</h3>
        <p className="text-sm text-muted-foreground">
          This application is currently migrating from WordPress to Next.js.
          Some features may be temporarily unavailable. Thank you for your
          patience during this transition.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Phase: Foundation & Shell | Status: In Progress
        </p>
      </div>
    </div>
  );
}
