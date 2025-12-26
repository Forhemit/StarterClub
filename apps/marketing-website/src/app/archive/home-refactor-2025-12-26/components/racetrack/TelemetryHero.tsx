"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";

import { VisualStoryboard } from "@/components/racetrack/VisualStoryboard";
import { UnicornTestModal } from "@/components/UnicornTestModal";

export function TelemetryHero() {
    const [mounted, setMounted] = useState(false);
    const [isTestOpen, setIsTestOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">

            {/* 
            ========================================================================
             LUXURY / EXCLUSIVE VIEW (Default)
             Vibe: Silence, Jewelry Store, Deep Void, Gold
            ========================================================================
            */}
            <div className="block racetrack:hidden w-full h-full relative overflow-hidden">
                {/* Cinematic Background - Glowing Particles */}
                <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                    {/* Static Noise Overlay for Texture */}
                    <div className="absolute inset-0 opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-20" />

                    {/* Generative Gold Nebulas (Background Ambience) */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10s] z-0" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[15s] delay-1000 z-0" />

                    {/* Glowing Particles System - Client Side Only to prevent Hydration Mismatch */}
                    <div className="absolute inset-0 z-10 w-full h-full">
                        {mounted && Array.from({ length: 50 }).map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    background: "radial-gradient(circle at 30% 30%, #ffffff, #d4af37, #8a6e1d)", // Real Gold Texture
                                }}
                                initial={{
                                    opacity: 0,
                                    scale: Math.random() * 0.5 + 0.5,
                                }}
                                animate={{
                                    opacity: [0, Math.random() * 0.8 + 0.5, 0], // Higher max opacity for shine
                                    scale: [0.5, 1.2, 0.5],
                                    y: [0, Math.random() * 100 + 50] // Falling down (gravity)
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 3, // 3-6s duration
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: Math.random() * 5
                                }}
                                className="absolute w-1.5 h-1.5 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(212,175,55,0.6)]" // Sharper, shiny gold shadow
                            />
                        ))}
                    </div>
                </div>

                <div className="relative z-30 container mx-auto px-4 min-h-[90vh] flex flex-col items-center justify-center text-center space-y-12">

                    {/* Elegant Status Pilli */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-signal-green shadow-[0_0_10px_rgba(0,255,157,0.8)]"
                        />
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.2em]">San Francisco · Private Access</span>
                    </motion.div>

                    {/* Main Title - Serif/Display */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-heading text-5xl md:text-8xl font-bold text-foreground leading-[1.1] tracking-tight"
                    >
                        Is your business <br />
                        <span className="text-primary font-light italic">unicorn ready?</span>
                    </motion.h1>

                    {/* Subtext - Clean, wide spacing */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans font-light leading-relaxed"
                    >
                        Success (especially long term) isn't an accident. It's a design. Is your business built to succeed or will it fail to reach success?
                    </motion.p>

                    {/* Actions - Minimalist Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col items-center gap-4 pt-8"
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => setIsTestOpen(true)}
                                className="group relative px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 font-sans text-xs uppercase tracking-[0.25em] font-semibold">Free Unicorn Ready Test</span>
                                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                            <button className="group relative px-8 py-4 bg-transparent text-foreground border border-primary/30 hover:border-primary transition-all duration-500">
                                <span className="relative z-10 font-sans text-xs uppercase tracking-[0.25em] group-hover:text-primary transition-colors">Free Day Pass</span>
                                <div className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                        </div>
                        <p className="text-muted-foreground text-sm font-sans">Live in Bay Area? Come visit Starter Club Today</p>
                    </motion.div>
                </div>
            </div>


            {/* 
            ========================================================================
             RACE TRACK VIEW (Locked Legacy)
             Vibe: F1 Telemetry, High Contrast, Data Dense
            ========================================================================
            */}
            <div className="hidden racetrack:block w-full h-full relative pt-20">
                {/* Background Grid - Topographical Map Effect */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Copy & Command */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 border border-signal-yellow/30 bg-signal-yellow/10 px-3 py-1 rounded text-xs font-mono text-signal-yellow uppercase tracking-widest">
                            <Activity className="w-3 h-3" />
                            <span>Status: Unverified</span>
                        </div>

                        <h1 className="font-sans text-5xl md:text-7xl font-bold text-foreground leading-tight uppercase tracking-tighter">
                            Is your business <br /><span className="text-signal-green">Actually Safe?</span>
                        </h1>

                        <VisualStoryboard />

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                            <button
                                onClick={() => setIsTestOpen(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-signal-green text-carbon font-bold uppercase tracking-widest hover:bg-signal-green/90 transition-all flex items-center justify-center gap-2 clip-corner-button"
                            >
                                Free Unicorn Ready Test
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 border border-border text-foreground font-mono uppercase tracking-widest hover:bg-secondary/50 transition-all">
                                Free Day Pass
                            </button>
                        </div>
                    </div>

                    {/* Right: Telemetry HUD Visual */}
                    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto flex items-center justify-center">

                        {/* Outer Ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                            className="absolute inset-0 border border-border rounded-full border-dashed"
                        />

                        {/* The Tachometer */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-card rounded-full border border-border flex items-center justify-center shadow-2xl shadow-signal-green/5">
                            <div className="absolute inset-2 border-4 border-border rounded-full" />

                            {/* Redline Zone */}
                            <div className="absolute inset-0 rounded-full border-t-4 border-signal-red w-full h-full rotate-45 opacity-50" />

                            {/* Center Data */}
                            <div className="text-center space-y-2 z-10">
                                <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Business Health Score</div>
                                <div className="text-6xl font-bold text-foreground font-mono tabular-nums">
                                    64<span className="text-lg text-white/40">%</span>
                                </div>
                                <div className="text-signal-yellow text-xs font-mono uppercase tracking-widest animate-pulse">
                                    Attention Required
                                </div>
                            </div>

                            {/* Rotating Indicator */}
                            <motion.div
                                initial={{ rotate: -90 }}
                                animate={{ rotate: 45 }}
                                transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                                className="absolute w-full h-1 bg-transparent z-0"
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-signal-green rounded-full shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
                            </motion.div>
                        </div>

                        {/* Floating Widgets */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-4 top-1/4 bg-carbon-light border-l-2 border-signal-green p-4 w-48 shadow-lg"
                        >
                            <div className="flex items-center gap-3 text-white mb-1">
                                <ShieldCheck className="w-4 h-4 text-signal-green" />
                                <span className="text-xs font-bold uppercase">Compliance</span>
                            </div>
                            <div className="w-full bg-white/10 h-1 mt-2">
                                <div className="w-[80%] h-full bg-signal-green" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 }}
                            className="absolute -left-4 bottom-1/4 bg-carbon-light border-r-2 border-signal-yellow p-4 w-48 text-right shadow-lg"
                        >
                            <div className="flex items-center justify-end gap-3 text-white mb-1">
                                <span className="text-xs font-bold uppercase">Growth Speed</span>
                                <Zap className="w-4 h-4 text-signal-yellow" />
                            </div>
                            <div className="text-2xl font-mono text-white">200<span className="text-xs text-white/40">mph</span></div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* Unicorn Test Modal */}
            <UnicornTestModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} />
        </section>
    );
}
