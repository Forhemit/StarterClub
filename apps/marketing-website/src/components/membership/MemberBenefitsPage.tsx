"use client";

import React from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Footer } from "@/components/Footer";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { BenefitsHero } from "./sections/BenefitsHero";
import { MembershipTiers } from "./sections/MembershipTiers";
import { CertificationBenefits } from "./sections/CertificationBenefits";
import { FaaSShowcase } from "./sections/FaaSShowcase";

// ============================================================================
// MEMBER BENEFITS PAGE
// Dual-themed (Corporate + Racing) page showcasing membership tiers and
// the Starter Club Business Certification following AIDA psychological flow.
// ============================================================================

export default function MemberBenefitsPage() {
    return (
        <main className="relative min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <BackgroundLayer />
            <RaceTrackNav />

            {/* Section 1: Hero / Value Proposition - ATTENTION */}
            <BenefitsHero />

            {/* Section 2: Membership Tiers - INTEREST */}
            <MembershipTiers />

            {/* Section 3: Certification Benefits - DESIRE */}
            <CertificationBenefits />

            {/* Section 4: Foundation-as-a-Service - ACTION */}
            <FaaSShowcase />

            <Footer />
        </main>
    );
}
