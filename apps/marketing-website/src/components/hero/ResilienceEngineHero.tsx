"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AssessmentModal } from "./AssessmentModal";

const IMAGES = [
    {
        src: "/images/hero/StrawBusiness.png",
        alt: "Straw Business",
        label: "Business Made of Straw",
        shortLabel: "Straw",
        color: "text-amber-500",
        description: "Built on hustle. Collapses when chaos hits.",
    },
    {
        src: "/images/hero/WoodBusiness.png",
        alt: "Wood Business",
        label: "Wood",
        shortLabel: "Wood",
        color: "text-amber-700",
        description: "Some structure. Survives minor blows, needs repairs.",
    },
    {
        src: "/images/hero/BrickBusiness.png",
        alt: "Brick Business",
        label: "Brick",
        shortLabel: "Brick",
        color: "text-emerald-500",
        description: "Built to last. Chaos-proof. Transferable.",
    },
];

const GALLERY_INTERVAL = 5000; // 5 seconds per image

export function ResilienceEngineHero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance gallery
    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        
        const timer = setInterval(nextImage, GALLERY_INTERVAL);
        return () => clearInterval(timer);
    }, [isPaused, nextImage]);

    const currentImage = IMAGES[currentIndex];

    return (
        <>
            <section className="relative w-full min-h-screen bg-background overflow-hidden">
                <div className="container mx-auto px-4 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
                        
                        {/* Left: Image Gallery (7 cols) */}
                        <div className="lg:col-span-7 relative">
                            <div 
                                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={currentImage.src}
                                            alt={currentImage.alt}
                                            fill
                                            className="object-cover"
                                            priority={currentIndex === 0}
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Progress bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: isPaused ? "0%" : "100%" }}
                                        transition={{ 
                                            duration: isPaused ? 0.3 : GALLERY_INTERVAL / 1000, 
                                            ease: "linear" 
                                        }}
                                        key={currentIndex}
                                    />
                                </div>

                                {/* Pause indicator */}
                                {isPaused && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs"
                                    >
                                        Paused
                                    </motion.div>
                                )}
                            </div>

                            {/* Current Label - Rotates with image */}
                            <div className="text-center mt-4">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`text-lg font-bold uppercase tracking-wider ${currentImage.color}`}
                                    >
                                        {currentImage.label}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Dot indicators with labels */}
                            <div className="flex justify-center gap-4 mt-4">
                                {IMAGES.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                                            idx === currentIndex 
                                                ? `${img.color} bg-muted` 
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        aria-label={`Go to ${img.label}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full transition-all ${
                                            idx === currentIndex ? "bg-current" : "bg-current opacity-50"
                                        }`} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {img.shortLabel}
                                        </span>
                                    </button>
                                ))}
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
                                    Will life destroy your business?
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

                            {/* Current image description */}
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-4 bg-muted rounded-xl"
                            >
                                <span className="text-2xl">
                                    {currentIndex === 0 ? "🌾" : currentIndex === 1 ? "🪵" : "🧱"}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    {currentImage.description}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <motion.button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative px-8 py-4 bg-signal-green text-carbon font-bold uppercase tracking-wider hover:bg-signal-green/90 transition-all flex items-center gap-3 overflow-hidden rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:shadow-[0_0_50px_rgba(0,255,157,0.5)]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{
                                        boxShadow: [
                                            "0 0 20px rgba(0,255,157,0.3)",
                                            "0 0 40px rgba(0,255,157,0.5)",
                                            "0 0 20px rgba(0,255,157,0.3)",
                                        ],
                                    }}
                                    transition={{
                                        boxShadow: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        },
                                    }}
                                >
                                    {/* Pulse ring effect */}
                                    <span className="absolute inset-0 rounded-xl bg-signal-green/30 animate-ping" style={{ animationDuration: '2s' }} />
                                    
                                    <span className="relative z-10 flex items-center gap-3">
                                        <motion.span
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                        >
                                            🎯
                                        </motion.span>
                                        Take the 3 Question Test
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="group-hover:translate-x-1 transition-transform"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </motion.svg>
                                    </span>
                                </motion.button>
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
