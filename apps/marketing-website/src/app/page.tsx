"use client";

import React from "react";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { LiveTicker } from "@/components/racetrack/LiveTicker";
import { TelemetryHero } from "@/components/racetrack/TelemetryHero";
import { DecayVisualizer } from "@/components/racetrack/DecayVisualizer";
import { WarRoomTerminal } from "@/components/racetrack/WarRoomTerminal";
import { TierGarage } from "@/components/racetrack/TierGarage";

import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

// Content Injection
import { ProblemAgitation } from "@/components/content-injection/ProblemAgitation";
import { SolutionStack } from "@/components/content-injection/SolutionStack";
import { PBCTrust } from "@/components/content-injection/PBCTrust";
import { FreeOffer } from "@/components/content-injection/FreeOffer";
import { SocialProof } from "@/components/content-injection/SocialProof";

export default function RaceTrackHome() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">

      <RaceTrackNav />

      <div className="pt-16"> {/* Spacer for fixed nav */}
        <TelemetryHero />

        <LiveTicker />

        <ProblemAgitation className="dark bg-background text-foreground" />
        <SolutionStack className="dark bg-background text-foreground" />
        <PBCTrust className="dark bg-background text-foreground" />
        <FreeOffer className="dark bg-background text-foreground" />
        <SocialProof className="dark bg-background text-foreground" />

        <DecayVisualizer />

        <TierGarage />

        <WarRoomTerminal />
      </div>

      <RaceTrackFooter />

    </main>
  );
}
