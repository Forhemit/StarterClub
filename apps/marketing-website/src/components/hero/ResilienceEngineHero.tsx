"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Player } from "@remotion/player";
import { ResilienceVideo, VIDEO_CONFIG } from "./ResilienceVideo";
import { AssessmentModal } from "./AssessmentModal";

// Fallback poster frame component (Frame 210 - Brick House victory)
const VideoPoster = () => (
    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
            <span className="text-6xl">🏰</span>
            <p className="text-signal-green font-bold mt-4">SYSTEMATIZED</p>
        </div>
    </div>
);

export function ResilienceEngineHero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isInView, setIsInView] = useState(true);
    const playerRef = useRef<Player>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for performance (pause when < 20% visible)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.2);
            },
            { threshold: [0, 0.2, 0.5, 1] }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Control video playback based on visibility
    useEffect(() => {
        if (!playerRef.current) return;

        if (isInView) {
            playerRef.current.play();
        } else {
            playerRef.current.pause();
        }
    }, [isInView]);

    return (
        <>
            <section
                ref={containerRef}
                className="relative w-full min-h-screen bg-background overflow-hidden"
            >
                <div className="container mx-auto px-4 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
                        
                        {/* Left: Video (7 cols) */}
                        <div className="lg:col-span-7 relative">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl">
                                {/* Remotion Player */}
                                <Player
                                    ref={playerRef}
                                    component={ResilienceVideo}
                                    durationInFrames={VIDEO_CONFIG.durationInFrames}
                                    fps={VIDEO_CONFIG.fps}
                                    compositionWidth={VIDEO_CONFIG.width}
                                    compositionHeight={VIDEO_CONFIG.height}
                                    style={{ width: "100%", height: "100%" }}
                                    controls={false}
                                    autoPlay={false}
                                    loop
                                    acknowledgeRemotionLicense
                                    renderLoading={() => <VideoPoster />}
                                    onLoaded={() => setIsVideoLoaded(true)}
                                />

                                {/* Loading overlay */}
                                {!isVideoLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
                                        />
                                    </div>
                                )}

                                {/* Reduced motion fallback */}
                                <noscript>
                                    <VideoPoster />
                                </noscript>
                            </div>

                            {/* Labels below video */}
                            <div className="flex justify-between mt-4 px-4 text-xs font-bold uppercase tracking-wider">
                                <span className="text-amber-500">The Hustle</span>
                                <span className="text-amber-700">Typical SMB</span>
                                <span className="text-emerald-500">Systematized</span>
                            </div>
                        </div>

                        {/* Right: Copy & CTA (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
                                    The Big Bad Wolf Is Coming.{" "}
                                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
                                        Is Your Business Built of Straw or Brick?
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-prose"
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
                                    className="group relative px-8 py-4 bg-slate-900 dark:bg-primary text-white dark:text-primary-foreground font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-3 overflow-hidden rounded-xl"
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
                                className="flex flex-wrap items-center gap-6 pt-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="w-2 h-2 bg-signal-green rounded-full animate-pulse" />
                                    <span>3-Minute Assessment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    <span>Instant Results</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="w-2 h-2 bg-signal-yellow rounded-full" />
                                    <span>No Email Required</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Assessment Modal */}
            <AssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
