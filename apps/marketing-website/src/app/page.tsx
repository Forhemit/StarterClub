"use client";

import React from "react";
import { LiveTicker } from "@/components/racetrack/LiveTicker";
import { DecayVisualizer } from "@/components/racetrack/DecayVisualizer";
import { WarRoomTerminal } from "@/components/racetrack/WarRoomTerminal";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

// NEW HERO: Resilience Engine (Remotion-based)
import { ResilienceEngineHero } from "@/components/hero";

// Content Injection
import { ProblemAgitation } from "@/components/content-injection/ProblemAgitation";
import { SolutionStack } from "@/components/content-injection/SolutionStack";
import { PBCTrust } from "@/components/content-injection/PBCTrust";
import { FreeOffer } from "@/components/content-injection/FreeOffer";
import { SocialProof } from "@/components/content-injection/SocialProof";

// Membership Benefits
import { BenefitsRooms } from "@/components/membership/sections/BenefitsRooms";

// ARCHIVE: For A/B Testing
// import { ThreeLittlePigsHero } from "@/components/hero";
// import { TelemetryHero } from "@/components/racetrack/TelemetryHero";

export default function RaceTrackHome() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">

      {/* NEW HERO: Resilience Engine with Remotion Video */}
      <ResilienceEngineHero />

      <LiveTicker />

      {/* Active Simulation */}
      <WarRoomTerminal />

      {/* The Spaces - Benefits Rooms */}
      <BenefitsRooms />

      <ProblemAgitation className="dark bg-background text-foreground" />
      <SolutionStack className="dark bg-background text-foreground" />
      <PBCTrust className="dark bg-background text-foreground" />
      <FreeOffer className="dark bg-background text-foreground" />
      <SocialProof className="dark bg-background text-foreground" />

      <DecayVisualizer />

      <RaceTrackFooter />

    </main>
  );
}
