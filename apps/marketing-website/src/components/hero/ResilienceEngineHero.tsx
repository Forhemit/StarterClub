"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AssessmentModal } from "./AssessmentModal";

const IMAGES = [
    {
        src: "/images/hero/StrawBusiness.png",
        alt: "Straw Business - The Hustle",
        label: "THE HUSTLE",
        color: "text-amber-500",
        description: "Built on hustle. Collapses when chaos hits.",
    },
    {
        src: "/images/hero/WoodBusiness.png",
        alt: "Wood Business - Typical SMB",
        label: "TYPICAL SMB",
        color: "text-amber-700",
        description: "Some structure. Survives minor blows, needs repairs.",
    },
    {
        src: "/images/hero/BrickBusiness.png",
        alt: "Brick Business - Systematized Enterprise",
        label: "SYSTEMATIZED",
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

                            {/* Labels below gallery */}
                            <div className="flex justify-between mt-4 px-4">
                                {IMAGES.map((img, idx) => (
                                    <button
                                        key={img.label}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`text-xs font-bold uppercase tracking-wider transition-all ${
                                            idx === currentIndex 
                                                ? img.color 
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {img.label}
                                    </button>
                                ))}
                            </div>

                            {/* Dot indicators */}
                            <div className="flex justify-center gap-2 mt-4">
                                {IMAGES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === currentIndex 
                                                ? "bg-primary w-6" 
                                                : "bg-muted hover:bg-muted-foreground"
                                        }`}
                                        aria-label={`Go to image ${idx + 1}`}
                                    />
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
