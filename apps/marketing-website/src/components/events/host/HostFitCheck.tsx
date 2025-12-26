"use client";

import React from "react";
import { Check, X } from "lucide-react";

export function HostFitCheck() {
    return (
        <section className="py-24 bg-secondary/5 racetrack:bg-carbon-light border-y border-border/50 racetrack:border-signal-blue/20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center font-heading racetrack:font-sans racetrack:uppercase">
                    Is This Right for You?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* GOOD FIT */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 racetrack:bg-signal-green/10 racetrack:text-signal-green">
                                <Check className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-heading racetrack:font-sans uppercase">A Successful Host</h3>
                        </div>
                        <ul className="space-y-6">
                            {[
                                "Serves founders, small businesses, or operators.",
                                "Believes that education builds better, long-term customers.",
                                "Values quality of connection over quantity of leads."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-1 shrink-0 racetrack:text-signal-green" />
                                    <span className="text-lg text-foreground racetrack:font-mono">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BAD FIT */}
                    <div className="space-y-8 opacity-80">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 racetrack:bg-signal-red/10 racetrack:text-signal-red">
                                <X className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-heading racetrack:font-sans uppercase">Probably NOT a fit if...</h3>
                        </div>
                        <ul className="space-y-6">
                            {[
                                "You are looking for a traditional sales pitch platform.",
                                "You want passive brand sponsorship without engagement.",
                                "You expect instant sales without providing value first."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <X className="w-5 h-5 text-red-500 mt-1 shrink-0 racetrack:text-signal-red" />
                                    <span className="text-lg text-muted-foreground racetrack:font-mono">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
