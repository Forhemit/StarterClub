"use client";

import React from "react";

export function HostPartners() {
    return (
        <section className="py-20 border-y border-border/50 bg-secondary/5 racetrack:bg-black racetrack:border-signal-blue/20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8 racetrack:font-mono racetrack:text-signal-blue">
                    TRUSTED BY INNOVATIVE TEAMS
                </p>

                {/* Placeholders for Partner Logos */}
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale transition-all hover:grayscale-0 mb-16">
                    {/* Replaced with generic shapes/text for boilerplate */}
                    <div className="h-8 w-32 bg-foreground/20 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-foreground/20 rounded animate-pulse" />
                    <div className="h-8 w-32 bg-foreground/20 rounded animate-pulse" />
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="text-3xl md:text-4xl font-light italic text-foreground leading-relaxed racetrack:font-mono racetrack:not-italic racetrack:uppercase racetrack:text-2xl racetrack:tracking-wider">
                        "Hosting our workshop at Starter Club was the most <span className="text-primary font-bold not-italic racetrack:text-signal-green">efficient way</span> to connect with serious founders. The conversations we had led directly to three pilot partnerships."
                    </div>
                    <div className="mt-8">
                        <div className="font-bold text-lg racetrack:font-sans racetrack:uppercase">Sarah Jenkins</div>
                        <div className="text-muted-foreground racetrack:font-mono text-sm">Head of Growth, TechExample Inc.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
