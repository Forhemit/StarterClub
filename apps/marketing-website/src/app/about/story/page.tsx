import React from "react";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";
import { OurStoryMission } from "@/components/story/OurStoryMission";

export const metadata = {
    title: "Our Story & Mission | Starter Club SF",
    description: "We are mechanics for business health. Learn about our mission to tune the operational health of businesses for sustained performance, resilience, and long-term growth.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">
            <RaceTrackNav />
            <div className="pt-16">
                <OurStoryMission />
            </div>
            <RaceTrackFooter />
        </main>
    );
}
