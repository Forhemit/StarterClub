import React from "react";
import { ImpactMetrics } from "@/components/impact/ImpactMetrics";

export const metadata = {
    title: "Our Impact | Starter Club PBC",
    description: "Measuring what matters: access, health, resilience, sustainability, transferability, and regional economic durability. Our annual public benefit metrics framework.",
};

export default function ImpactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">
            <ImpactMetrics />
        </main>
    );
}
