import { TierGarage } from "@/components/racetrack/TierGarage";
import { FoundersContent } from "./FoundersContent";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Founders Program | Starter Club",
  description: "Support and resources for first-time founders. Choose your membership level and start building a resilient business.",
};

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FoundersContent />
      <TierGarage />
    </main>
  );
}
