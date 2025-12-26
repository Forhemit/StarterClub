"use client";

import React from "react";
import { HostHero } from "./HostHero";
import { HostValueProps } from "./HostValueProps";
import { HostPartners } from "./HostPartners";
import { HostProcess } from "./HostProcess";
import { HostFitCheck } from "./HostFitCheck";
import { HostCTA } from "./HostCTA";
import { HostFAQ } from "./HostFAQ";

// Import RaceTrack components for the layout wrapper structure if needed
// Or simply user a Main generic wrapper
// Based on the user request, we are using the current homepage theme as template.
// The homepage uses RaceTrackNav and RaceTrackFooter in one version, and standard Footer in another.
// We will use standard layout components here, assuming the Layout file handles global nav, 
// OR we will include them if this page is standalone like the RaceTrackHome.
// Given the folder structure /app/events/host, it likely inherits the root layout!
// BUT the RaceTrackHome in /app/page.tsx explicitly includes RaceTrackNav.
// I will adhere to the "Race Track Home Page UI Design" instruction by including the Nav if appropriate, 
// but since this is a sub-page, standard layout inheritance is cleaner.
// HOWEVER, to ensure the "Race Track" vibe works, I'll assume the styling is handled by CSS classes I added.

export function HostEventPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <HostHero />
            <HostValueProps />
            <HostPartners />
            <HostProcess />
            <HostFitCheck />
            <HostCTA />
            <HostFAQ />
        </main>
    );
}
