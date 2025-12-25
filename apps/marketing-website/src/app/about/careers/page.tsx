import React from "react";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata = {
    title: "Careers | Starter Club SF",
    description: "Join our mission to tune the operational health of businesses. We're building the infrastructure that helps companies perform at their peak—and sustain it.",
};

export default function Careers() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">
            <RaceTrackNav />
            <div className="pt-16">
                <CareersPage />
            </div>
            <RaceTrackFooter />
        </main>
    );
}
