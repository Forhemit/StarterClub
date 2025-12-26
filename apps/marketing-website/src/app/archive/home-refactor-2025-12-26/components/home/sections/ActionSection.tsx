"use client";

import { WaitlistForm } from "@/components/WaitlistForm";

export function ActionSection() {
    return (
        <div className="w-full max-w-2xl mx-auto text-center space-y-8 mb-20">
            <div className="space-y-4">
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-black">
                    Claim Your Founding Member Spot.
                </h2>
                <p className="font-sans text-black/70">
                    Early access to hard-hat tours, launch party invites, and &quot;Founder Tier&quot; pricing.
                </p>
            </div>

            <WaitlistForm />
        </div>
    );
}
