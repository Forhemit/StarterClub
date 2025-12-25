"use client";

import React from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Footer } from "@/components/Footer";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { BenefitsHero } from "./sections/BenefitsHero";
import { EcosystemPillars } from "./sections/EcosystemPillars";
import { MembershipTiers } from "./sections/MembershipTiers";
import { BuilderTrack } from "./sections/BuilderTrack";
import { BenefitsRooms } from "./sections/BenefitsRooms";
import { SuperStations } from "./sections/SuperStations";
import { PartnerCatalyst } from "./sections/PartnerCatalyst";
import { CallToAlignment } from "./sections/CallToAlignment";

// ============================================================================
// MEMBER BENEFITS PAGE
// Dual-themed (Corporate + Racing) page showcasing the complete member journey
// Following AIDA psychological flow: Attention → Interest → Desire → Action
// 
// Three Core Pillars:
// 1. The Crew (Membership Tiers) - Your peer circle
// 2. The Blueprint (6-Month Builder Track) - Your proven path
// 3. The Spaces (BenefitsRooms) - Your elite HQ
// 4. The Arsenal (Super Stations) - Your pro tools
// ============================================================================

export default function MemberBenefitsPage() {
    return (
        <main className="relative min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <BackgroundLayer />
            <RaceTrackNav />

            {/* SECTION 1: Hero - ATTENTION */}
            {/* "Your Foundation, Accelerated" - Present membership as a unified operating system */}
            <BenefitsHero />

            {/* SECTION 2: Three Pillars - INTEREST */}
            {/* Visual introduction to the interconnected ecosystem */}
            <EcosystemPillars />

            {/* SECTION 3: Your Crew (Membership Tiers) - INTEREST */}
            {/* Show community as a progression of support, not just features */}
            <MembershipTiers />

            {/* SECTION 4: Your Blueprint (6-Month Track) - DESIRE */}
            {/* Make the structured journey feel immersive and achievable */}
            <BuilderTrack />

            {/* SECTION 5: The Spaces (Rooms) - DESIRE */}
            {/* "Quietly Elite" - Provide physical context for the work */}
            <BenefitsRooms />

            {/* SECTION 6: Your Arsenal (Super Stations) - DESIRE */}
            {/* Present hardware as specialized performance instruments */}
            <SuperStations />

            {/* SECTION 7: Partner Network - DESIRE */}
            {/* Show partners as force multipliers integrated into the journey */}
            <PartnerCatalyst />

            {/* SECTION 8: Call to Alignment - ACTION */}
            {/* Convert interest into commitment - "Where do you start?" */}
            <CallToAlignment />

            <Footer />
        </main>
    );
}
