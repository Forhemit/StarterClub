"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RaceTrackNav } from "@/components/racetrack/RaceTrackNav";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

export default function SummitPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <RaceTrackNav />
            {/* Spacer for fixed nav handled by pt-16 in container or here */}

            <div className="flex-1 relative flex flex-col items-center justify-center w-full overflow-hidden pt-16">
                {/* Background Ambience - Theme Aware */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_60%)] opacity-5 blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_60%)] opacity-5 blur-[100px]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center my-12">
                    {/* Antigravity Entrance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                Coming Soon
                            </span>
                        </div>

                        {/* Main Display Title */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 font-heading">
                            Summit
                            <br />
                            <span className="text-primary">2026</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl font-light text-muted-foreground font-sans max-w-lg mx-auto">
                            The ultimate gathering for founders, creators, and iconoclasts.
                            <br />
                            <span className="font-mono text-sm tracking-widest mt-2 block opacity-70">
                                LATE 2026 • SAN FRANCISCO
                            </span>
                        </p>

                        {/* CTA / Action */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="pt-8"
                        >
                            <Link href="/" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300">
                                <span className="uppercase tracking-widest border-b border-transparent group-hover:border-primary pb-0.5">Return Home</span>
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <RaceTrackFooter />
        </main>
    );
}
