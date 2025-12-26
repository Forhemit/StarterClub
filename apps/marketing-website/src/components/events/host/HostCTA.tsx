"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function HostCTA() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-primary/5 racetrack:bg-signal-green/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 font-heading racetrack:font-sans racetrack:uppercase tracking-tighter">
                    Ready to Propose Your Event Idea?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto racetrack:font-mono">
                    Let’s discuss how your expertise can meet our community’s needs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary/25 racetrack:bg-signal-green racetrack:text-black racetrack:rounded-none racetrack:uppercase racetrack:tracking-widest flex items-center gap-2">
                        Propose Your Event Idea
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
