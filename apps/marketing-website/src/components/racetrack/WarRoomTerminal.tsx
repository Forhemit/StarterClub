"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Sparkles } from "lucide-react";
import { UnicornTestModal } from "@/components/UnicornTestModal";

export function WarRoomTerminal() {
    const [lines, setLines] = useState<string[]>([
        "> INITIALIZING WAR ROOM SIMULATOR_V10.2...",
        "> LOADING SCENARIO: FOUNDER_DISPUTE_PROTOCOL...",
        "> CHECKING ASSET PROTECTION...",
    ]);
    const [isTestOpen, setIsTestOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLines(prev => [...prev, "> ERROR: BUY/SELL AGREEMENT NOT FOUND.", "> CALCULATING IMPACT..."]);
        }, 1500);

        const timer2 = setTimeout(() => {
            setLines(prev => [...prev, "> RESULT: ASSETS FROZEN. 90 DAY DRAG DETECTED.", "> STATUS: CRITICAL FAILURE."]);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <section className="w-full py-24 bg-muted/50 border-y border-border">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Copy */}
                <div className="space-y-6 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 text-signal-red font-mono text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 bg-signal-red rounded-full animate-pulse" />
                        Active Simulation
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                        Don't Wait for <br />A <span className="text-signal-red">Crisis.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg font-mono leading-relaxed">
                        We don't just store documents. We stress-test them. <br />
                        Run scenarios to see if your business survives a dispute or audit.
                    </p>
                    {/* Swapped: Now Free Unicorn Ready Test with modal */}
                    <button 
                        onClick={() => setIsTestOpen(true)}
                        className="flex items-center gap-3 text-signal-green font-mono uppercase tracking-widest text-sm hover:text-foreground transition-colors group"
                    >
                        <Sparkles className="w-4 h-4" />
                        Free Unicorn Ready Test
                    </button>
                </div>

                {/* Right: Terminal Visual - Updated to use theme variables */}
                <div className="order-1 lg:order-2 bg-background rounded-lg border border-border p-2 shadow-2xl">
                    <div className="bg-muted px-4 py-2 rounded-t flex items-center gap-2 border-b border-border">
                        <div className="w-3 h-3 rounded-full bg-signal-red/20" />
                        <div className="w-3 h-3 rounded-full bg-signal-yellow/20" />
                        <div className="w-3 h-3 rounded-full bg-signal-green/20" />
                        <div className="ml-auto text-xs font-mono text-muted-foreground">admin@starterclub:~/sim</div>
                    </div>
                    <div className="p-6 font-mono text-sm md:text-base min-h-[300px] text-signal-green/80 space-y-2 bg-background rounded-b">
                        {lines.map((line, i) => (
                            <div key={i} className={`${line.includes("ERROR") || line.includes("FAILURE") ? "text-signal-red" : ""} ${line.includes("IMPACT") ? "text-signal-yellow" : ""}`}>
                                {line}
                            </div>
                        ))}
                        <div className="animate-pulse">_</div>
                    </div>
                </div>

            </div>

            {/* Unicorn Test Modal */}
            <UnicornTestModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} />
        </section>
    );
}
