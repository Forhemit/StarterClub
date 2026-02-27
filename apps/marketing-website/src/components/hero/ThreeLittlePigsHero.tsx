"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThreeLittlePigsModal } from "./ThreeLittlePigsModal";

// Animated Wolf SVG Component
function WolfSVG({ state }: { state: "blowing" | "exhausted" | "normal" }) {
    return (
        <motion.svg
            viewBox="0 0 120 120"
            className="w-24 h-24"
            animate={state === "blowing" ? { x: [0, -2, 2, -1, 1, 0] } : {}}
            transition={{ duration: 0.5, repeat: state === "blowing" ? Infinity : 0 }}
        >
            {/* Wolf Body */}
            <circle cx="60" cy="60" r="35" fill="#64748b" />
            {/* Ears */}
            <polygon points="35,35 45,10 55,35" fill="#64748b" />
            <polygon points="65,35 75,10 85,35" fill="#64748b" />
            {/* Snout */}
            <ellipse cx="60" cy="70" rx="15" ry="12" fill="#94a3b8" />
            <circle cx="60" cy="68" r="6" fill="#1e293b" />
            {/* Eyes */}
            <circle cx="50" cy="55" r="4" fill="#1e293b" />
            <circle cx="70" cy="55" r="4" fill="#1e293b" />
            {/* Cheeks - turn blue when exhausted */}
            <circle
                cx="45" cy="65" r="6"
                fill={state === "exhausted" ? "#3b82f6" : "#fca5a5"}
                opacity={state === "exhausted" ? 0.6 : 0.4}
            />
            <circle
                cx="75" cy="65" r="6"
                fill={state === "exhausted" ? "#3b82f6" : "#fca5a5"}
                opacity={state === "exhausted" ? 0.6 : 0.4}
            />
            {/* Wind Lines - show when blowing */}
            {state === "blowing" && (
                <>
                    <motion.line x1="85" y1="70" x2="110" y2="65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <motion.line x1="85" y1="75" x2="105" y2="75" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <motion.line x1="85" y1="80" x2="110" y2="85" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                </>
            )}
        </motion.svg>
    );
}

// Straw House Component
function StrawHouse({ destroyed }: { destroyed: boolean }) {
    return (
        <motion.div
            className="relative"
            animate={destroyed ? { opacity: 0, scale: 0.5, rotate: 20 } : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6 }}
        >
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {/* Straw structure */}
                <path d="M20 40 L50 10 L80 40" fill="none" stroke="#d4a574" strokeWidth="3" />
                <rect x="25" y="40" width="50" height="50" fill="#e8d5b7" stroke="#d4a574" strokeWidth="2" />
                {/* Straw lines texture */}
                <line x1="30" y1="40" x2="30" y2="90" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
                <line x1="40" y1="40" x2="40" y2="90" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="40" x2="50" y2="90" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
                <line x1="60" y1="40" x2="60" y2="90" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
                <line x1="70" y1="40" x2="70" y2="90" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
                {/* Door */}
                <rect x="42" y="65" width="16" height="25" fill="#8b6914" />
            </svg>
            {destroyed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-4xl">💨</span>
                </motion.div>
            )}
        </motion.div>
    );
}

// Wood House Component
function WoodHouse({ damaged }: { damaged: boolean }) {
    return (
        <motion.div className="relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {/* Wood structure */}
                <rect x="20" y="35" width="60" height="55" fill="#a67c52" stroke="#8b6239" strokeWidth="3" />
                {/* Wood planks */}
                <line x1="20" y1="45" x2="80" y2="45" stroke="#8b6239" strokeWidth="2" />
                <line x1="20" y1="55" x2="80" y2="55" stroke="#8b6239" strokeWidth="2" />
                <line x1="20" y1="65" x2="80" y2="65" stroke="#8b6239" strokeWidth="2" />
                <line x1="20" y1="75" x2="80" y2="75" stroke="#8b6239" strokeWidth="2" />
                {/* Roof */}
                <path d="M15 35 L50 5 L85 35" fill="#8b4513" stroke="#654321" strokeWidth="2" />
                {/* Door */}
                <rect x="42" y="65" width="16" height="25" fill="#5d3a1a" />
                {/* Window */}
                <rect x="28" y="48" width="12" height="12" fill="#87ceeb" stroke="#5d3a1a" strokeWidth="2" />
                <rect x="60" y="48" width="12" height="12" fill="#87ceeb" stroke="#5d3a1a" strokeWidth="2" />
            </svg>
            {/* Damage overlays */}
            {damaged && (
                <>
                    <motion.div
                        initial={{ y: 0, rotate: 0 }}
                        animate={{ y: -40, rotate: -15, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute top-0 left-4"
                    >
                        <div className="w-16 h-8 bg-[#8b4513] rounded" />
                    </motion.div>
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 10 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="absolute top-0 left-0 w-full h-full"
                    >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="text-2xl">🚪</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: 20, opacity: 0.7 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute top-8 left-6"
                    >
                        <span className="text-xl">🔲</span>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}

// Brick House Component
function BrickHouse() {
    return (
        <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
        >
            <svg viewBox="0 0 100 100" className="w-36 h-36">
                {/* Brick structure */}
                <rect x="15" y="30" width="70" height="65" fill="#8b4513" stroke="#5d3a1a" strokeWidth="2" />
                {/* Brick pattern */}
                <line x1="15" y1="42" x2="85" y2="42" stroke="#a0522d" strokeWidth="2" />
                <line x1="15" y1="54" x2="85" y2="54" stroke="#a0522d" strokeWidth="2" />
                <line x1="15" y1="66" x2="85" y2="66" stroke="#a0522d" strokeWidth="2" />
                <line x1="15" y1="78" x2="85" y2="78" stroke="#a0522d" strokeWidth="2" />
                {/* Vertical brick lines - offset rows */}
                <line x1="32" y1="30" x2="32" y2="42" stroke="#a0522d" strokeWidth="2" />
                <line x1="50" y1="30" x2="50" y2="42" stroke="#a0522d" strokeWidth="2" />
                <line x1="68" y1="30" x2="68" y2="42" stroke="#a0522d" strokeWidth="2" />
                <line x1="23" y1="42" x2="23" y2="54" stroke="#a0522d" strokeWidth="2" />
                <line x1="41" y1="42" x2="41" y2="54" stroke="#a0522d" strokeWidth="2" />
                <line x1="59" y1="42" x2="59" y2="54" stroke="#a0522d" strokeWidth="2" />
                <line x1="77" y1="42" x2="77" y2="54" stroke="#a0522d" strokeWidth="2" />
                {/* Fortress roof */}
                <path d="M10 30 L50 0 L90 30" fill="#5d3a1a" stroke="#3d2310" strokeWidth="2" />
                {/* Reinforced door */}
                <rect x="40" y="60" width="20" height="35" fill="#4a3728" stroke="#2d1f14" strokeWidth="2" />
                <circle cx="56" cy="78" r="2" fill="#ffd700" />
                {/* Reinforced window */}
                <rect x="22" y="45" width="12" height="12" fill="#87ceeb" stroke="#4a3728" strokeWidth="3" />
                <line x1="28" y1="45" x2="28" y2="57" stroke="#4a3728" strokeWidth="2" />
                <line x1="22" y1="51" x2="34" y2="51" stroke="#4a3728" strokeWidth="2" />
                {/* Light in window */}
                <circle cx="28" cy="51" r="3" fill="#ffd700" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>
        </motion.div>
    );
}

export function ThreeLittlePigsHero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [animationPhase, setAnimationPhase] = useState(0);

    // Auto-advance animation phases
    React.useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationPhase(1), 1500), // Straw destroyed
            setTimeout(() => setAnimationPhase(2), 3000), // Wood damaged
            setTimeout(() => setAnimationPhase(3), 4500), // Brick - wolf exhausted
            setTimeout(() => setAnimationPhase(0), 6500), // Reset
        ];
        return () => timers.forEach(clearTimeout);
    }, [animationPhase === 0]);

    const getWolfState = () => {
        if (animationPhase === 0) return "normal";
        if (animationPhase === 1 || animationPhase === 2) return "blowing";
        return "exhausted";
    };

    return (
        <>
            <section className="relative w-full min-h-screen flex items-center bg-background overflow-hidden">
                <div className="container mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        
                        {/* Left: Animation */}
                        <div className="relative flex flex-col items-center justify-center min-h-[400px] bg-muted/30 rounded-2xl p-8">
                            {/* Labels */}
                            <div className="absolute top-4 left-4 bg-signal-red/10 text-signal-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                MARKET CHAOS
                            </div>

                            {/* Animation Stage */}
                            <div className="relative flex items-end justify-center gap-8 mt-12">
                                {/* Wolf */}
                                <div className="flex flex-col items-center">
                                    <WolfSVG state={getWolfState()} />
                                    <motion.div
                                        animate={animationPhase === 3 ? { y: [0, 10, 0] } : {}}
                                        transition={{ duration: 0.5, repeat: animationPhase === 3 ? 2 : 0 }}
                                        className="text-center mt-2"
                                    >
                                        {animationPhase === 3 && (
                                            <span className="text-xs text-muted-foreground">*huff puff*</span>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Houses */}
                                <div className="flex items-end gap-4">
                                    {/* Straw */}
                                    <div className="flex flex-col items-center">
                                        <StrawHouse destroyed={animationPhase >= 1} />
                                        <span className={`text-xs font-bold uppercase mt-2 transition-all ${animationPhase >= 1 ? 'text-signal-red' : 'text-muted-foreground'}`}>
                                            THE HUSTLE
                                        </span>
                                    </div>

                                    {/* Wood */}
                                    <div className="flex flex-col items-center">
                                        <WoodHouse damaged={animationPhase >= 2} />
                                        <span className={`text-xs font-bold uppercase mt-2 transition-all ${animationPhase >= 2 ? 'text-signal-yellow' : 'text-muted-foreground'}`}>
                                            TYPICAL SMB
                                        </span>
                                    </div>

                                    {/* Brick */}
                                    <div className="flex flex-col items-center">
                                        <BrickHouse />
                                        <span className="text-xs font-bold uppercase mt-2 text-signal-green">
                                            SYSTEMATIZED
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status text */}
                            <div className="mt-8 text-center">
                                <motion.p
                                    key={animationPhase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-mono text-muted-foreground"
                                >
                                    {animationPhase === 0 && "The wolf approaches..."}
                                    {animationPhase === 1 && "Straw businesses collapse instantly..."}
                                    {animationPhase === 2 && "Wood businesses barely survive..."}
                                    {animationPhase === 3 && "Brick businesses stand strong ✓"}
                                </motion.p>
                            </div>
                        </div>

                        {/* Right: Copy & CTA */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                    The Big Bad Wolf Is Coming.{" "}
                                    <span className="text-primary">Is Your Business Built of Straw or Brick?</span>
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
                            >
                                Most businesses are built on hustle and heroics—they look okay until the wind blows. 
                                True resilience requires systems that can survive without you.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-3 overflow-hidden"
                                >
                                    <span className="relative z-10">Take the "Real World" Readiness Test</span>
                                    <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </button>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex items-center gap-6 pt-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="w-2 h-2 bg-signal-green rounded-full animate-pulse" />
                                    <span>3-Minute Assessment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    <span>Instant Results</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <ThreeLittlePigsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
