"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Zap,
    CheckCircle2,
    Wrench,
    CircleDot,
    Timer,
    Gauge,
    Star
} from "lucide-react";

/**
 * CareersCTA - Section 5: Invitation & Pivot / Action
 * 
 * Corporate Theme (Brutalist/Raw):
 * - Space Mono Bold + Instrument Sans typography
 * - Raw concrete panel with exposed rebar
 * - Concrete gray, steel, safety orange
 * - Tactile roughness textures
 * - CTA button lowered by construction crane (simplified)
 * 
 * Racing Theme (Cyber-Physical):
 * - Nasalization + VT323 typography
 * - Drag strip with Christmas tree lights
 * - Burnout smoke effects
 * - Staging sequence animation
 * - Reaction time tester (simplified)
 */

// Sample job openings data
const openPositions = [
    { title: "Senior Full-Stack Engineer", department: "Engineering", location: "SF / Remote" },
    { title: "Product Designer", department: "Design", location: "SF Bay Area" },
    { title: "Business Operations Lead", department: "Operations", location: "San Francisco" },
    { title: "Customer Success Manager", department: "Support", location: "Remote" },
];

export function CareersCTA() {
    const [mounted, setMounted] = useState(false);
    const [lightSequence, setLightSequence] = useState<number>(0);
    const [isLaunching, setIsLaunching] = useState(false);
    const [reactionStart, setReactionStart] = useState<number | null>(null);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [waitingForGreen, setWaitingForGreen] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Christmas tree light sequence
    useEffect(() => {
        if (isInView && mounted) {
            const runSequence = () => {
                setLightSequence(0);
                setIsLaunching(false);

                // Pre-stage
                setTimeout(() => setLightSequence(1), 500);
                // Stage
                setTimeout(() => setLightSequence(2), 1000);
                // Amber 1
                setTimeout(() => setLightSequence(3), 1500);
                // Amber 2
                setTimeout(() => setLightSequence(4), 1900);
                // Amber 3
                setTimeout(() => setLightSequence(5), 2300);
                // GO!
                setTimeout(() => {
                    setLightSequence(6);
                    setIsLaunching(true);
                }, 2700);

                // Reset
                setTimeout(() => {
                    setLightSequence(0);
                    setIsLaunching(false);
                }, 5000);
            };

            runSequence();
            const interval = setInterval(runSequence, 6000);
            return () => clearInterval(interval);
        }
    }, [isInView, mounted]);

    // Reaction time tester
    const startReactionTest = () => {
        setReactionTime(null);
        setWaitingForGreen(true);

        // Random delay between 1-4 seconds
        const delay = Math.random() * 3000 + 1000;

        setTimeout(() => {
            setReactionStart(Date.now());
            setWaitingForGreen(false);
        }, delay);
    };

    const handleReactionClick = () => {
        if (reactionStart && !waitingForGreen) {
            setReactionTime(Date.now() - reactionStart);
            setReactionStart(null);
        } else if (waitingForGreen) {
            // False start
            setWaitingForGreen(false);
            setReactionTime(-1); // Indicates false start
        }
    };

    return (
        <>
            {/* ========== CORPORATE / BRUTALIST THEME ========== */}
            <section className="relative w-full py-32 overflow-hidden block racetrack:hidden">
                {/* Concrete Texture Background */}
                <div className="absolute inset-0 concrete-texture opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

                {/* Rebar Lines */}
                <div className="absolute left-[10%] top-0 bottom-0 w-1 rebar-line opacity-40" />
                <div className="absolute right-[10%] top-0 bottom-0 w-1 rebar-line opacity-40" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Tagline Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#ff6600]/10 border border-[#ff6600]/30">
                            <Zap className="w-5 h-5 text-[#ff6600]" />
                            <span className="text-[#ff6600] font-mono text-sm uppercase tracking-[0.2em]">
                                Diagnose. Tune. Endure.
                            </span>
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                            Ready to Build<br />
                            <span className="text-[#ff6600]">Something That Lasts?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                            We're looking for mechanics, not passengers. People who want to build infrastructure that actually matters.
                        </p>
                    </motion.div>

                    {/* Open Positions Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-16"
                        id="open-positions"
                    >
                        <h3 className="text-center text-muted-foreground font-mono text-sm uppercase tracking-widest mb-6">
                            Open Positions
                        </h3>

                        <div className="space-y-3">
                            {openPositions.map((job, index) => (
                                <motion.a
                                    key={job.title}
                                    href="#"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center justify-between p-4 bg-muted/50 border border-border hover:border-[#ff6600]/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 bg-[#ff6600] rounded-full" />
                                        <div>
                                            <span className="text-foreground font-medium">{job.title}</span>
                                            <span className="text-muted-foreground text-sm ml-2">· {job.department}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground text-sm hidden sm:block">{job.location}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#ff6600] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
                    >
                        <a
                            href="#"
                            className="group relative px-10 py-5 bg-[#ff6600] text-white hover:bg-[#ff6600]/90 transition-all duration-500 overflow-hidden"
                        >
                            <span className="relative z-10 font-mono text-sm uppercase tracking-[0.2em] font-bold flex items-center gap-3">
                                View All Positions
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </a>

                        <a
                            href="#culture"
                            className="group px-10 py-5 border border-[#ff6600]/30 text-foreground hover:border-[#ff6600] transition-all duration-500"
                        >
                            <span className="font-mono text-sm uppercase tracking-[0.2em] group-hover:text-[#ff6600] transition-colors">
                                Learn About Our Culture
                            </span>
                        </a>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm"
                    >
                        {[
                            "San Francisco Based",
                            "Public Benefit Corporation",
                            "Remote-Friendly",
                            "Built for Longevity",
                        ].map((signal) => (
                            <div key={signal} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#ff6600]" />
                                <span>{signal}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ========== RACING / DRAG STRIP THEME ========== */}
            <section
                ref={sectionRef}
                className="relative w-full py-24 overflow-hidden hidden racetrack:block bg-black"
            >
                {/* Track texture */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                                repeating-linear-gradient(
                                    0deg,
                                    transparent,
                                    transparent 40px,
                                    rgba(255,255,255,0.02) 40px,
                                    rgba(255,255,255,0.02) 80px
                                )
                            `,
                        }}
                    />
                </div>

                {/* Timing beams */}
                <div className="absolute left-[20%] top-0 bottom-0 timing-beam" />
                <div className="absolute right-[20%] top-0 bottom-0 timing-beam" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Left: Christmas Tree & Content */}
                        <div className="space-y-8">
                            {/* Tagline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-3 border border-signal-green/30 bg-signal-green/10 px-6 py-3"
                            >
                                <Zap className="w-5 h-5 text-signal-green" />
                                <span className="text-signal-green font-mono uppercase tracking-widest">
                                    Diagnose. Tune. Endure.
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="font-orbitron text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter"
                            >
                                Ready to <span className="text-signal-green">Launch?</span>
                            </motion.h2>

                            {/* Subtext */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-muted-foreground font-mono text-lg"
                            >
                                Join the pit crew. Build systems that help businesses go the distance.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <a
                                    href="#open-positions"
                                    className={`px-10 py-5 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${lightSequence === 6
                                            ? "bg-signal-green text-black animate-pulse"
                                            : "bg-signal-green/80 text-black"
                                        }`}
                                >
                                    <Gauge className="w-5 h-5" />
                                    View Open Positions
                                </a>
                                <a
                                    href="#culture"
                                    className="px-10 py-5 border border-signal-green/30 text-signal-green font-mono uppercase tracking-widest hover:bg-signal-green/10 transition-all"
                                >
                                    Our Culture
                                </a>
                            </motion.div>

                            {/* Trust Signals */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="flex flex-wrap gap-6 text-muted-foreground font-mono text-xs uppercase tracking-widest"
                            >
                                {["SF Bay Area", "PBC Certified", "Remote OK", "Built to Last"].map((signal) => (
                                    <div key={signal} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-signal-green rounded-full" />
                                        <span>{signal}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right: Christmas Tree Lights */}
                        <div className="flex flex-col items-center">
                            <div className="bg-black border border-border p-8 relative">
                                {/* Tree structure */}
                                <div className="flex flex-col items-center gap-6">
                                    {/* Pre-stage / Stage */}
                                    <div className="flex gap-4">
                                        {[1, 2].map((stage) => (
                                            <div
                                                key={`stage-${stage}`}
                                                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${lightSequence >= stage
                                                        ? "border-white bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                                                        : "border-white/30 bg-black"
                                                    }`}
                                            >
                                                <CircleDot className={`w-6 h-6 ${lightSequence >= stage ? "text-black" : "text-white/30"}`} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Amber lights */}
                                    {[3, 4, 5].map((amber) => (
                                        <div key={`amber-${amber}`} className="flex gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-full border-2 transition-all duration-150 ${lightSequence >= amber
                                                        ? "border-yellow-500 bg-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.9)]"
                                                        : "border-yellow-500/30 bg-black"
                                                    }`}
                                            />
                                            <div
                                                className={`w-12 h-12 rounded-full border-2 transition-all duration-150 ${lightSequence >= amber
                                                        ? "border-yellow-500 bg-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.9)]"
                                                        : "border-yellow-500/30 bg-black"
                                                    }`}
                                            />
                                        </div>
                                    ))}

                                    {/* Green GO lights */}
                                    <div className="flex gap-4">
                                        {[1, 2].map((green) => (
                                            <div
                                                key={`green-${green}`}
                                                className={`w-12 h-12 rounded-full border-2 transition-all duration-100 ${lightSequence === 6
                                                        ? "border-signal-green bg-signal-green shadow-[0_0_30px_rgba(0,255,157,1)]"
                                                        : "border-signal-green/30 bg-black"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="mt-8 text-center">
                                    <div className={`font-orbitron text-2xl font-bold uppercase ${lightSequence === 6 ? "text-signal-green animate-pulse" : "text-muted-foreground"
                                        }`}>
                                        {lightSequence === 0 && "Waiting..."}
                                        {lightSequence === 1 && "Pre-Stage"}
                                        {lightSequence === 2 && "Staged"}
                                        {lightSequence >= 3 && lightSequence <= 5 && "Ready..."}
                                        {lightSequence === 6 && "GO!"}
                                    </div>
                                </div>
                            </div>

                            {/* Reaction Time Tester */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="mt-8 w-full max-w-xs"
                            >
                                <div className="text-center text-muted-foreground font-mono text-xs uppercase tracking-widest mb-4">
                                    Test Your Reaction Time
                                </div>

                                {reactionStart === null && reactionTime === null && !waitingForGreen ? (
                                    <button
                                        onClick={startReactionTest}
                                        className="w-full py-4 bg-muted border border-border text-foreground font-mono uppercase tracking-widest hover:bg-secondary/50 transition-all"
                                    >
                                        Start Test
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleReactionClick}
                                        className={`w-full py-4 font-mono uppercase tracking-widest transition-all ${waitingForGreen
                                                ? "bg-signal-red text-white"
                                                : reactionStart
                                                    ? "bg-signal-green text-black"
                                                    : "bg-muted border border-border text-foreground"
                                            }`}
                                    >
                                        {waitingForGreen ? "Wait..." : reactionStart ? "CLICK NOW!" : "Start Test"}
                                    </button>
                                )}

                                {reactionTime !== null && (
                                    <div className="mt-4 text-center">
                                        {reactionTime === -1 ? (
                                            <div className="text-signal-red font-orbitron text-xl">
                                                FALSE START!
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-signal-green font-orbitron text-3xl font-bold">
                                                    {reactionTime} ms
                                                </div>
                                                <div className="text-muted-foreground font-mono text-xs mt-2">
                                                    {reactionTime < 200 ? "F1 Driver Level! 🏎️" :
                                                        reactionTime < 300 ? "Great Reaction!" :
                                                            reactionTime < 400 ? "Good Job!" : "Keep Practicing!"}
                                                </div>
                                                <div className="text-muted-foreground font-mono text-xs mt-1 opacity-50">
                                                    Pro drivers: ~200ms
                                                </div>
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                setReactionTime(null);
                                                setReactionStart(null);
                                            }}
                                            className="mt-3 text-signal-green text-xs font-mono uppercase tracking-widest hover:underline"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Burnout Smoke Effect */}
                <AnimatePresence>
                    {isLaunching && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0.5 }}
                                animate={{ opacity: 0.6, scaleX: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#333333] to-transparent"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 0.8, 0], y: -100 }}
                                transition={{ duration: 2 }}
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 tire-smoke"
                            />
                        </>
                    )}
                </AnimatePresence>
            </section>
        </>
    );
}
