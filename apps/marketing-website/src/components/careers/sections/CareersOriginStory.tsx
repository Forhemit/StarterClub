"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flame, Terminal, AlertCircle, CheckCircle, Clock, Lightbulb } from "lucide-react";

/**
 * CareersOriginStory - Section 2: The "Why" / Interest
 * 
 * Corporate Theme (Magazine/Editorial):
 * - DM Serif Display Italic + Satoshi typography
 * - Broken grid with spark SVG animation
 * - Warm paper texture with sepia tones
 * - Page-turn reveal animation
 * - Timeline as torn paper tape measure
 * 
 * Racing Theme (Retro-Interface 90s):
 * - Racing Sans One + Share Tech Mono
 * - Dashboard gauge cluster interface
 * - Green CRT display with scanlines
 * - Telemetry-style text scroll
 * - Crash impact diagram visualization
 */

const storyContent = {
    beforeState: {
        title: "The Problem We Saw",
        content: "We watched brilliant entrepreneurs—people with incredible vision—stumble and fall. Not because their ideas weren't good. Not because they didn't work hard. But because the operational infrastructure beneath them was built on sand.",
    },
    catalyst: {
        title: "The Breaking Point",
        content: "Businesses collapsing under compliance issues they didn't know existed. Founders burning out managing chaos instead of building dreams. Generic checklists that expired the moment they were completed. Consultants charging fortunes for advice that didn't stick.",
    },
    decision: {
        title: "Our Response",
        content: "We decided to build what we wished existed—a continuous operational health system that diagnoses, monitors, and fortifies businesses for the long race ahead.",
    },
};

const timelineEvents = [
    { year: "2023", event: "The spark ignites", label: "Foundation" },
    { year: "2024", event: "First diagnostic built", label: "Prototype" },
    { year: "2025", event: "Team expansion begins", label: "Growth" },
];

// Telemetry log entries for racing theme
const telemetryLogs = [
    { type: "error", code: "E001", message: "60% business failure rate within 5 years" },
    { type: "warning", code: "W002", message: "Root cause: infrastructure decay" },
    { type: "warning", code: "W003", message: "Existing solutions: static, expired on delivery" },
    { type: "info", code: "I004", message: "Solution required: continuous diagnostic system" },
    { type: "success", code: "S005", message: "Initializing Starter Club protocol..." },
];

export function CareersOriginStory() {
    const [mounted, setMounted] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<number>(0);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isInView && mounted) {
            const interval = setInterval(() => {
                setVisibleLogs((prev) => {
                    if (prev >= telemetryLogs.length) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 600);
            return () => clearInterval(interval);
        }
    }, [isInView, mounted]);

    return (
        <>
            {/* ========== CORPORATE / EDITORIAL THEME ========== */}
            <section
                ref={sectionRef}
                className="relative w-full py-32 overflow-hidden block racetrack:hidden"
            >
                {/* Paper Texture Background */}
                <div className="absolute inset-0 light:paper-texture dark:bg-muted/30" />
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.3em] mb-4 block">
                            Our Origin Story
                        </span>
                        <h2 className="font-dm-serif text-4xl md:text-6xl font-normal text-foreground italic">
                            Why We Started This
                        </h2>
                    </motion.div>

                    {/* Broken Grid Layout with Story */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-6xl mx-auto">
                        {/* Left Column - Main Story */}
                        <div className="lg:col-span-7 space-y-12">
                            {/* Before State */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                                <h3 className="font-dm-serif text-2xl md:text-3xl text-foreground mb-4 italic">
                                    {storyContent.beforeState.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed font-sans font-light light:text-[#3d2c1a]">
                                    {storyContent.beforeState.content}
                                </p>
                            </motion.div>

                            {/* Catalyst */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="relative pl-8 lg:pl-16"
                            >
                                <div className="absolute left-0 top-4 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Flame className="w-3 h-3 text-primary" />
                                </div>
                                <h3 className="font-dm-serif text-2xl md:text-3xl text-foreground mb-4 italic">
                                    {storyContent.catalyst.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed font-sans font-light light:text-[#3d2c1a]">
                                    {storyContent.catalyst.content}
                                </p>
                            </motion.div>

                            {/* Decision */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="bg-foreground text-background p-8 lg:p-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
                                <h3 className="font-dm-serif text-2xl md:text-3xl mb-4 italic relative z-10">
                                    {storyContent.decision.title}
                                </h3>
                                <p className="text-lg leading-relaxed font-sans font-light relative z-10 opacity-90">
                                    {storyContent.decision.content}
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Column - Spark SVG & Timeline */}
                        <div className="lg:col-span-5 space-y-12">
                            {/* Animated Spark/Lightbulb */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="relative flex items-center justify-center py-12"
                            >
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            "0 0 20px rgba(var(--primary), 0.2)",
                                            "0 0 60px rgba(var(--primary), 0.4)",
                                            "0 0 20px rgba(var(--primary), 0.2)",
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center"
                                >
                                    <Lightbulb className="w-16 h-16 text-primary" />
                                </motion.div>
                            </motion.div>

                            {/* Timeline as Torn Paper */}
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

                                <div className="space-y-8">
                                    {timelineEvents.map((event, index) => (
                                        <motion.div
                                            key={event.year}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.15 }}
                                            viewport={{ once: true }}
                                            className="flex items-start gap-6 relative"
                                        >
                                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold relative z-10">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 bg-card border border-border p-4 relative">
                                                {/* Torn edge effect */}
                                                <div
                                                    className="absolute -left-2 top-0 bottom-0 w-2 opacity-20"
                                                    style={{
                                                        background: "repeating-linear-gradient(0deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)",
                                                    }}
                                                />
                                                <span className="text-primary font-mono text-sm">{event.year}</span>
                                                <h4 className="text-foreground font-medium mt-1">{event.event}</h4>
                                                <span className="text-muted-foreground text-xs uppercase tracking-widest">{event.label}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    <motion.blockquote
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mt-20 text-center"
                    >
                        <p className="font-dm-serif text-2xl md:text-3xl text-foreground italic leading-relaxed">
                            "We are mechanics for business health. We diagnose, tune, and fortify operations so companies can perform at their peak—and sustain it."
                        </p>
                    </motion.blockquote>
                </div>
            </section>

            {/* ========== RACING / CRT INTERFACE THEME ========== */}
            <section className="relative w-full py-24 overflow-hidden hidden racetrack:block bg-[#001a00]">
                {/* CRT Scanlines Overlay */}
                <div className="absolute inset-0 crt-scanlines z-10" />

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,255,157,0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,157,0.2) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-signal-yellow font-mono text-xs uppercase tracking-widest mb-4">
                            <Terminal className="w-4 h-4" />
                            <span>System Log: Origin</span>
                        </div>
                        <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-signal-green uppercase tracking-tighter crt-glow">
                            The Problem We<br />
                            <span className="text-signal-red">Couldn't Ignore</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Left: Terminal Log */}
                        <div className="bg-black/80 border border-signal-green/30 p-6 font-mono">
                            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-signal-green/20">
                                <div className="w-3 h-3 rounded-full bg-signal-red" />
                                <div className="w-3 h-3 rounded-full bg-signal-yellow" />
                                <div className="w-3 h-3 rounded-full bg-signal-green" />
                                <span className="text-signal-green text-xs ml-2">market_analysis.log</span>
                            </div>

                            <div className="space-y-3 min-h-[200px]">
                                <p className="text-signal-green text-sm">
                                    <span className="opacity-50">[{new Date().toISOString().split('T')[0]}]</span> &gt; Scanning market conditions...
                                </p>

                                {telemetryLogs.slice(0, visibleLogs).map((log, index) => (
                                    <motion.div
                                        key={log.code}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-start gap-2"
                                    >
                                        {log.type === "error" && <AlertCircle className="w-4 h-4 text-signal-red flex-shrink-0 mt-0.5" />}
                                        {log.type === "warning" && <Clock className="w-4 h-4 text-signal-yellow flex-shrink-0 mt-0.5" />}
                                        {log.type === "info" && <Terminal className="w-4 h-4 text-hud-cyan flex-shrink-0 mt-0.5" />}
                                        {log.type === "success" && <CheckCircle className="w-4 h-4 text-signal-green flex-shrink-0 mt-0.5" />}
                                        <p className={`text-sm ${log.type === "error" ? "text-signal-red" :
                                                log.type === "warning" ? "text-signal-yellow" :
                                                    log.type === "success" ? "text-signal-green" :
                                                        "text-hud-cyan"
                                            }`}>
                                            <span className="opacity-50">[{log.code}]</span> {log.message}
                                        </p>
                                    </motion.div>
                                ))}

                                {visibleLogs < telemetryLogs.length && (
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="inline-block w-2 h-4 bg-signal-green"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right: Decision Panel */}
                        <div className="space-y-6">
                            {/* Decision Statement */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-signal-green/10 border-l-4 border-signal-green p-6"
                            >
                                <h3 className="text-signal-green font-bold uppercase tracking-widest text-sm mb-3">
                                    The Decision
                                </h3>
                                <p className="text-foreground font-mono text-lg leading-relaxed">
                                    {storyContent.decision.content}
                                </p>
                            </motion.div>

                            {/* Timeline Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {timelineEvents.map((event, index) => (
                                    <motion.div
                                        key={event.year}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-black border border-signal-green/30 p-4 text-center"
                                    >
                                        <span className="text-signal-green font-orbitron text-2xl font-bold block">
                                            {event.year}
                                        </span>
                                        <span className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                                            {event.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quote Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                viewport={{ once: true }}
                                className="bg-muted p-6 border border-border"
                            >
                                <p className="text-muted-foreground font-mono text-sm italic">
                                    "We are mechanics for business health. We diagnose, tune, and fortify operations so companies can perform at their peak—and sustain it."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
