"use client";

import React from "react";
import { CheckCircle2, Scale } from "lucide-react";
import Image from "next/image"; // Assuming we might use an image for the visual element, or just text/badge

interface PBCTrustProps {
    className?: string;
}

export function PBCTrust({ className = "" }: PBCTrustProps) {
    return (
        <section id="pbc_trust" className={`w-full py-24 bg-muted/30 px-6 md:px-12 ${className}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Scale className="w-3 h-3" /> Fiduciary Commitment
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
                        We're Built to Make You More Resilient. <br />
                        <span className="text-muted-foreground italic">It's in Our Charter.</span>
                    </h2>

                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            As a certified <strong className="text-foreground">Public Benefit Corporation</strong>, our mission to strengthen the economic fabric of our community is legally embedded in our company's DNA.
                        </p>
                        <p>
                            We are fiduciary-bound to prioritize your long-term resilience, not just our short-term revenue. This means our incentives are perfectly aligned with your success.
                        </p>
                        <p className="flex items-center gap-3 text-foreground font-medium">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            When you become more resilient, we fulfill our mission.
                        </p>
                    </div>
                </div>

                {/* Right: Visual Element (Badge/seal representation) */}
                <div className="flex justify-center lg:justify-end animate-in slide-in-from-right-8 duration-700 delay-100">
                    <div className="relative w-80 h-80 md:w-96 md:h-96 bg-background rounded-full border-8 border-muted shadow-2xl flex flex-col items-center justify-center p-8 text-center rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute inset-0 rounded-full border border-dashed border-gray-300 m-2 animate-[spin_60s_linear_infinite]" />

                        {/* Simple CSS Badge Representation if no image is available yet */}
                        <div className="w-24 h-24 bg-foreground text-background rounded-full flex items-center justify-center mb-6">
                            <span className="font-display font-bold text-3xl">PBC</span>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground mb-2">Certified Public Benefit Corp</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest">Legal commitment to <br />stakeholder benefit</p>

                        <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black font-bold text-xs py-2 px-4 rounded-full shadow-lg transform -rotate-6">
                            Officially Chartered
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
