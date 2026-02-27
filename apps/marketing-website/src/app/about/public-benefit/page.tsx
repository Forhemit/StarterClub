import React from "react";
import { PublicBenefitCommitment } from "@/components/public-benefit/PublicBenefitCommitment";

export const metadata = {
    title: "Public Benefit Commitment | Starter Club PBC",
    description: "Starter Club exists to build a more durable, equitable, and prosperous economy for San Francisco and the Bay Area. Learn about our Five Pillars of Economic Durability and our commitment as a Public Benefit Corporation.",
};

export default function PublicBenefitPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">
            <PublicBenefitCommitment />
        </main>
    );
}
