"use client";

import React from "react";
import { RaceTrackNav } from "../components/racetrack/RaceTrackNav";
import { LiveTicker } from "../components/racetrack/LiveTicker";
import { TelemetryHero } from "../components/racetrack/TelemetryHero";
import { DecayVisualizer } from "../components/racetrack/DecayVisualizer";
import { WarRoomTerminal } from "../components/racetrack/WarRoomTerminal";
import { TierGarage } from "../components/racetrack/TierGarage";
import { RaceTrackFooter } from "../components/racetrack/RaceTrackFooter";

export default function ArchivedRaceTrackHome() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">

            <RaceTrackNav />

            <div className="pt-16"> {/* Spacer for fixed nav */}
                <TelemetryHero />

                <LiveTicker />

                <DecayVisualizer />

                <TierGarage />

                <WarRoomTerminal />
            </div>

            <RaceTrackFooter />

        </main>
    );
}
