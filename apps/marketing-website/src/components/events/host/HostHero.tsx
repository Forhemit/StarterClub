"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap } from "lucide-react";

export function HostHero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">

            {/* 
            ========================================================================
             LUXURY / EXCLUSIVE VIEW (Default)
            ========================================================================
            */}
            <div className="block racetrack:hidden w-full h-full relative overflow-hidden">
                {/* Cinematic Background - Glowing Particles */}
                <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                    {/* Authentic Workshop Image Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                        style={{ backgroundImage: "url('/PrelaunchParty.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />

                    <div className="absolute inset-0 opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-20" />
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10s] z-0" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[15s] delay-1000 z-0" />

                    {/* Glowing Particles System */}
                    <div className="absolute inset-0 z-10 w-full h-full">
                        {mounted && Array.from({ length: 30 }).map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    background: "radial-gradient(circle at 30% 30%, #ffffff, #d4af37, #8a6e1d)",
                                }}
                                initial={{ opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
                                animate={{
                                    opacity: [0, Math.random() * 0.8 + 0.5, 0],
                                    scale: [0.5, 1.2, 0.5],
                                    y: [0, Math.random() * 100 + 50]
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: Math.random() * 5
                                }}
                                className="absolute w-1.5 h-1.5 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                            />
                        ))}
                    </div>
                </div>

                <div className="relative z-30 container mx-auto px-4 min-h-[90vh] flex flex-col items-center justify-center text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
                    >
                        <span className="text-primary font-sans text-xs uppercase tracking-[0.2em]">Partner Program</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-4xl"
                    >
                        Host a live event for founders who are <span className="text-primary font-light italic">ready to decide.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans font-light leading-relaxed"
                    >
                        Turn your expertise into authority and build lasting relationships with Starter Club’s curated community of builders.
                    </motion.p>
                </div>
            </div>

            {/* 
            ========================================================================
             RACE TRACK VIEW (Data Dense)
            ========================================================================
            */}
            <div className="hidden racetrack:block w-full h-full relative pt-20">
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

                <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 border border-signal-blue/30 bg-signal-blue/10 px-3 py-1 rounded text-xs font-mono text-signal-blue uppercase tracking-widest">
                            <Activity className="w-3 h-3" />
                            <span>Mode: Host Uplink</span>
                        </div>

                        <h1 className="font-sans text-5xl md:text-7xl font-bold text-foreground leading-tight uppercase tracking-tighter">
                            Host a live event for <span className="text-signal-green">Decisive Founders.</span>
                        </h1>

                        <p className="font-mono text-muted-foreground text-lg leading-relaxed max-w-xl">
                            Turn your expertise into authority. Engage with a curated community of builders who are actively deploying.
                        </p>
                    </div>

                    {/* Right Side Visual - HUD Element */}
                    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-signal-green/20 rounded-full border-dashed animate-spin-slow" />
                        <div className="relative w-64 h-64 bg-black/50 backdrop-blur-md rounded-full border border-signal-green/50 flex flex-col items-center justify-center text-center p-6 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                            <Zap className="w-12 h-12 text-signal-green mb-4" />
                            <div className="text-2xl font-bold text-white font-mono">HIGH SIGNAL</div>
                            <div className="text-xs text-signal-green uppercase tracking-widest mt-1">Audience Detected</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
