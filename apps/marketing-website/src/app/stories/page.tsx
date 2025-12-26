"use client";

import React from "react";
import { motion } from "framer-motion";
import { Construction, Sparkles } from "lucide-react";

import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

export default function SuccessStoriesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white flex flex-col">
            <RaceTrackNav />

            {/* Content Wrapper */}
            <div className="flex-grow pt-20 flex items-center justify-center relative overflow-hidden">

                {/* 
                ========================================================================
                 LUXURY / EXCLUSIVE VIEW (Default)
                ========================================================================
                */}
                <div className="block racetrack:hidden w-full text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-sm mx-auto">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-sans uppercase tracking-widest text-primary">Curating Excellence</span>
                        </div>

                        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight">
                            Success Stories<br />
                            <span className="text-muted-foreground font-light italic">Coming Soon</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-lg text-muted-foreground font-light leading-relaxed">
                            We are currently compiling the journeys of our most successful founders.
                            The blueprint to unicorn status is being documented.
                        </p>
                    </motion.div>
                </div>

                {/* 
                ========================================================================
                 RACE TRACK VIEW (Locked Legacy)
                ========================================================================
                */}
                <div className="hidden racetrack:block w-full max-w-4xl mx-auto px-4">
                    <div className="border border-signal-yellow/30 bg-black/40 backdrop-blur-md p-12 rounded-lg relative overflow-hidden">

                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: `linear-gradient(#F5E428 1px, transparent 1px), linear-gradient(90deg, #F5E428 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 flex flex-col items-center text-center space-y-8"
                        >
                            <div className="w-24 h-24 border-2 border-dashed border-signal-yellow rounded-full flex items-center justify-center animate-spin-slow">
                                <Construction className="w-10 h-10 text-signal-yellow" />
                            </div>

                            <div className="space-y-2">
                                <h1 className="font-mono text-4xl md:text-6xl font-bold uppercase tracking-tighter text-signal-yellow">
                                    Track Under Construction
                                </h1>
                                <div className="h-1 w-32 bg-signal-yellow mx-auto" />
                            </div>

                            <div className="font-mono text-signal-green text-lg tracking-widest">
                                &gt; COMPILING_TELEMETRY_DATA... <span className="animate-pulse">_</span>
                            </div>

                            <p className="font-mono text-muted-foreground max-w-2xl">
                                SYSTEM STATUS: GATHERING FOUNDER VICTORIES.
                                THE ARCHIVE WILL BE ONLINE SHORTLY. STANDBY FOR TRANSMISSION.
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-8">
                                <div className="border border-border p-4 bg-background/50">
                                    <div className="text-xs text-muted-foreground uppercase">Module</div>
                                    <div className="text-signal-green font-mono">STORIES</div>
                                </div>
                                <div className="border border-border p-4 bg-background/50">
                                    <div className="text-xs text-muted-foreground uppercase">Status</div>
                                    <div className="text-signal-yellow font-mono">PENDING</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>

            <RaceTrackFooter />
        </main>
    );
}
