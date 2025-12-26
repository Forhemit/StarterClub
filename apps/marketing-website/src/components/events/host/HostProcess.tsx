"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const steps = [
    {
        title: "Strategy Call",
        time: "4-6 weeks out",
        desc: "We align on goals, audience, and format to ensure the right fit."
    },
    {
        title: "Content Collaboration",
        time: "2-3 weeks out",
        desc: "We help you shape a useful, non-promotional agenda focused on member education."
    },
    {
        title: "Promotion",
        time: "Ongoing",
        desc: "We promote your event to our engaged member base, driving qualified attendance."
    },
    {
        title: "The Live Experience",
        time: "Event Day",
        desc: "You lead the session. We handle the logistics, moderation, and foster a collaborative environment."
    },
    {
        title: "Follow-Up",
        time: "Post Event",
        desc: "We facilitate a smooth pathway for members to continue the conversation with you."
    }
];

export function HostProcess() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading racetrack:font-sans racetrack:uppercase">
                        How It Works: <span className="text-primary racetrack:text-signal-yellow">Your Event, Tailored</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto racetrack:font-mono">
                        Our process is designed to make hosting seamless and impactful. Here’s a typical timeline:
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border racetrack:bg-signal-yellow/20 md:left-1/2 md:-ml-px" />

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Icon / Marker */}
                                <div className="absolute left-0 md:left-1/2 md:-ml-5 w-10 h-10 rounded-full bg-background border-2 border-primary racetrack:border-signal-yellow flex items-center justify-center z-10 shrink-0">
                                    <span className="text-xs font-bold text-primary racetrack:text-signal-yellow">{index + 1}</span>
                                </div>

                                {/* Content Spacer for Layout */}
                                <div className="flex-1 hidden md:block" />

                                {/* Content Card */}
                                <div className="flex-1 ml-16 md:ml-0 md:px-12">
                                    <div className="p-6 rounded-xl bg-secondary/5 border border-border/50 racetrack:bg-black/40 racetrack:border-signal-yellow/30 relative">
                                        <div className="text-sm text-primary mb-2 font-semibold uppercase tracking-wider racetrack:text-signal-yellow racetrack:font-mono">
                                            {step.time}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 font-heading racetrack:font-sans racetrack:uppercase">{step.title}</h3>
                                        <p className="text-muted-foreground racetrack:font-mono text-sm">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
