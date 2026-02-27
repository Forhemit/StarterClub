"use client";

import React from "react";
import { LiveTicker } from "@/components/racetrack/LiveTicker";
import { DecayVisualizer } from "@/components/racetrack/DecayVisualizer";
import { WarRoomTerminal } from "@/components/racetrack/WarRoomTerminal";
import { TierGarage } from "@/components/racetrack/TierGarage";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

// NEW HERO: Three Little Pigs
import { ThreeLittlePigsHero } from "@/components/hero";

// Content Injection
import { ProblemAgitation } from "@/components/content-injection/ProblemAgitation";
import { SolutionStack } from "@/components/content-injection/SolutionStack";
import { PBCTrust } from "@/components/content-injection/PBCTrust";
import { FreeOffer } from "@/components/content-injection/FreeOffer";
import { SocialProof } from "@/components/content-injection/SocialProof";

// ARCHIVE: For A/B Testing - Original TelemetryHero
// import { TelemetryHero } from "@/components/racetrack/TelemetryHero";

export default function RaceTrackHome() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">

      {/* NEW HERO: Three Little Pigs (full viewport, no padding needed) */}
      <ThreeLittlePigsHero />

      <LiveTicker />

      {/* Active Simulation */}
      <WarRoomTerminal />

      <ProblemAgitation className="dark bg-background text-foreground" />
      <SolutionStack className="dark bg-background text-foreground" />
      <PBCTrust className="dark bg-background text-foreground" />
      <FreeOffer className="dark bg-background text-foreground" />
      <SocialProof className="dark bg-background text-foreground" />

      <DecayVisualizer />

      <TierGarage />

      <RaceTrackFooter />

    </main>
  );
}
