"use client";

import React from "react";
import "@/app/about/careers/careers.css";

// Section Components
import { CareersHero } from "./sections/CareersHero";
import { CareersOriginStory } from "./sections/CareersOriginStory";
import { CareersJourney } from "./sections/CareersJourney";
import { CareersMissionVision } from "./sections/CareersMissionVision";
import { CareersCTA } from "./sections/CareersCTA";

/**
 * CareersPage - Main orchestrator for the Careers page
 * 
 * Implements dual themes following AIDA psychological flow:
 * 1. Hero (Attention) - Emotional hook
 * 2. Origin Story (Interest) - The "why"
 * 3. Journey & Proof (Desire) - Credibility building
 * 4. Mission & Vision (Desire) - Future building
 * 5. CTA (Action) - Invitation & pivot
 * 
 * Themes:
 * - Corporate (Light/Dark): Professional, avant-garde, luxury
 * - Racing: High-energy, F1-inspired, immersive
 */
export function CareersPage() {
    return (
        <div className="relative">
            {/* Section 1: Hero Header / Emotional Hook */}
            <CareersHero />

            {/* Section 2: Origin Story - "The Why" */}
            <CareersOriginStory />

            {/* Section 3: Journey & Proof - Building Credibility */}
            <CareersJourney />

            {/* Section 4: Mission & Vision - Future Building */}
            <CareersMissionVision />

            {/* Section 5: Invitation & CTA - The Pivot */}
            <CareersCTA />
        </div>
    );
}
