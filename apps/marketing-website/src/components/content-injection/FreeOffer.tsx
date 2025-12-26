"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FreeOfferProps {
    className?: string;
    onOpen?: () => void; // Support modal opening if passed
}

export function FreeOffer({ className = "", onOpen }: FreeOfferProps) {
    const valueProps = [
        "Instant Access: Set up your Secure Vault in minutes.",
        "Initial Health Scan: Get your baseline Resilience Score.",
        "Community Access: Join our network for best practices.",
        "Basic Simulations: Run your first tabletop drill."
    ];

    return (
        <section id="free_offer" className={`w-full py-32 bg-foreground text-background relative overflow-hidden ${className}`}>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center space-y-10">

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur text-sm font-medium text-white/90">
                    <Shield className="w-4 h-4" /> Risk-Free Start
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-white">
                        Begin Your Preparedness Journey. <br />
                        <span className="text-blue-400">No Cost, No Risk.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Join hundreds of San Francisco founders who are building businesses meant to last.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-left max-w-3xl mx-auto">
                    {valueProps.map((prop, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/90">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-black font-bold" />
                            </div>
                            <span className="text-sm md:text-base">{prop}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4 w-full pt-6">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-12 py-8 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all w-full md:w-auto group"
                        onClick={onOpen}
                    >
                        Start Free Membership
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-white/40 uppercase tracking-widest">
                        No credit card required • Upgrade anytime
                    </p>
                </div>

            </div>
        </section>
    );
}
