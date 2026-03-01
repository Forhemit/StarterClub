import { TierGarage } from "@/components/racetrack/TierGarage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Founders Program | Starter Club",
  description: "Support and resources for first-time founders. Choose your membership level and start building a resilient business.",
};

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Background Image */}
      <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1771483907738-43ac1de8bf5e?q=80&w=2940&auto=format&fit=crop')`,
          }}
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-white/70 font-mono text-sm uppercase tracking-widest mb-4">
            For Founders & Startups
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tighter mb-6">
            Build Your Business <span className="text-primary">Right.</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            First-time founders need more than hype. Get the tools, community, and 
            expert verification to build a business that lasts from day one.
          </p>
        </div>
      </section>

      {/* Membership Plans */}
      <TierGarage />
    </main>
  );
}
