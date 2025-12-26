"use client";

import React from "react";
import { MoveRight } from "lucide-react";

interface ProblemAgitationProps {
    // Allow passing urgency/theme props if needed
    className?: string;
}

export function ProblemAgitation({ className = "" }: ProblemAgitationProps) {
    return (
        <section
            id="problem_agitation"
            className={`w-full py-20 px-6 md:px-12 bg-background flex flex-col items-center justify-center text-center ${className}`}
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Statistic Anchor */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-6xl md:text-8xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 tracking-tighter">
                        83%
                    </span>
                    <span className="text-sm md:text-base font-mono uppercase tracking-widest text-muted-foreground">
                        of startups face a major operational shock within 3 years
                    </span>
                </div>

                {/* Headline & Body */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight text-foreground">
                        San Francisco's Hidden Tax: <br className="hidden md:block" />
                        <span className="text-red-500">Operational Fragility.</span>
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Founders here are masters of innovation but often lack the 'boring' systems that prevent disaster.
                        This fragility tax costs time, equity, and entire companies.
                        From cap table disputes to compliance fines, the difference between those that recover and those that fail isn't luck.
                        <span className="text-foreground font-semibold"> It's preparedness.</span>
                    </p>
                </div>

                {/* Social Proof Stat */}
                <div className="inline-flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-full border border-secondary/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                    <p className="text-sm font-medium text-foreground">
                        Starter Club members identify and resolve critical risks
                        <span className="font-bold text-signal-green ml-1">5x faster</span> than average.
                    </p>
                </div>

            </div>
        </section>
    );
}
