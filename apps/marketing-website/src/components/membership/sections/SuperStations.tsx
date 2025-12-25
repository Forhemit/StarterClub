"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { superStations } from "../data/membershipData";
import { X, ChevronRight, Cpu, Zap } from "lucide-react";

// ============================================================================
// SECTION 5: YOUR ARSENAL (SUPER STATIONS)
// Goal: Present the hardware as specialized performance instruments
// Corporate: Equipment rack view with metallic nameplates
// Racing: Team garage bay with car setups
// ============================================================================

export function SuperStations() {
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const [hoveredStation, setHoveredStation] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const activeStation = superStations.find(s => s.id === selectedStation);

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
            {/* ================================================================
                CORPORATE THEME - Equipment Rack / Lab View
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10 bg-background">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 mb-6">
                            Pillar 3 · The Arsenal
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Super Stations
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
                            Professional-grade workstations for creators, developers, and operators who demand the best.
                        </p>
                    </motion.div>

                    {/* Stations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {superStations.map((station, index) => {
                            const Icon = station.icon;
                            const isHovered = hoveredStation === station.id;

                            return (
                                <motion.div
                                    key={station.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.5,
                                        delay: index * 0.1
                                    }}
                                    onMouseEnter={() => setHoveredStation(station.id)}
                                    onMouseLeave={() => setHoveredStation(null)}
                                    onClick={() => setSelectedStation(station.id)}
                                    className={`
                                        group relative cursor-pointer overflow-hidden
                                        bg-card border rounded-xl transition-all duration-500
                                        ${isHovered
                                            ? "border-primary/50 shadow-xl shadow-primary/10 -translate-y-2"
                                            : "border-border hover:border-border/80"
                                        }
                                    `}
                                >
                                    {/* Metallic Nameplate Effect */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Icon */}
                                        <div className={`
                                            w-14 h-14 rounded-xl flex items-center justify-center mb-5
                                            transition-all duration-500
                                            ${isHovered
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                            }
                                        `}>
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-display text-xl font-bold text-foreground mb-1">
                                            {station.name}
                                        </h3>

                                        {/* Designation Badge */}
                                        <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs font-mono rounded mb-3">
                                            {station.designation}
                                        </span>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                            {station.description}
                                        </p>

                                        {/* Quick Specs */}
                                        <div className="space-y-2">
                                            {station.specs.slice(0, 2).map((spec, i) => (
                                                <div key={i} className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">{spec.label}</span>
                                                    <span className="text-foreground font-medium">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* View Details Link */}
                                        <div className={`
                                            mt-4 pt-4 border-t border-border flex items-center justify-between
                                            transition-colors duration-300
                                            ${isHovered ? "text-primary" : "text-muted-foreground"}
                                        `}>
                                            <span className="text-xs font-semibold uppercase tracking-wider">
                                                View Specs
                                            </span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ================================================================
                RACING THEME - Team Garage Bay
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10 bg-muted border-t border-b border-border">
                <div className="container mx-auto px-4 py-16">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-signal-green/30 bg-signal-green/5 mb-6 font-mono text-xs uppercase tracking-widest text-signal-green">
                            <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                            Garage Bay
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl font-bold text-foreground uppercase tracking-tight mb-4">
                            Team Machines
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                            Four specialized setups. Each tuned for peak performance.
                        </p>
                    </motion.div>

                    {/* Garage Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        {superStations.map((station, index) => {
                            const Icon = station.icon;
                            const isHovered = hoveredStation === station.id;

                            return (
                                <motion.div
                                    key={station.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.5,
                                        delay: index * 0.1
                                    }}
                                    onMouseEnter={() => setHoveredStation(station.id)}
                                    onMouseLeave={() => setHoveredStation(null)}
                                    onClick={() => setSelectedStation(station.id)}
                                    className={`
                                        group relative cursor-pointer
                                        bg-carbon-light border transition-all duration-300
                                        ${isHovered
                                            ? "border-signal-green shadow-[0_0_30px_rgba(0,255,157,0.15)]"
                                            : "border-border hover:border-signal-green/50"
                                        }
                                    `}
                                >
                                    {/* Top Indicator */}
                                    <div className={`
                                        h-1 w-full transition-all duration-300
                                        ${isHovered ? "bg-signal-green" : "bg-border"}
                                    `} />

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                                    {station.designation}
                                                </span>
                                                <h3 className="font-sans text-2xl font-bold text-foreground uppercase tracking-tight mt-1">
                                                    {station.name}
                                                </h3>
                                            </div>
                                            <div className={`
                                                w-12 h-12 flex items-center justify-center border
                                                transition-all duration-300
                                                ${isHovered
                                                    ? "border-signal-green bg-signal-green/10 text-signal-green"
                                                    : "border-border text-muted-foreground"
                                                }
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="font-mono text-sm text-muted-foreground mb-6">
                                            {station.description}
                                        </p>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {station.specs.map((spec, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 bg-background/50 border border-border"
                                                >
                                                    <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
                                                        {spec.label}
                                                    </div>
                                                    <div className="font-mono text-xs text-foreground font-medium truncate">
                                                        {spec.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`
                                                    w-2 h-2 rounded-full
                                                    ${isHovered ? "bg-signal-green animate-pulse" : "bg-muted-foreground"}
                                                `} />
                                                <span className="font-mono text-xs text-muted-foreground uppercase">
                                                    {isHovered ? "Ready" : "Standby"}
                                                </span>
                                            </div>
                                            <span className={`
                                                font-mono text-xs uppercase tracking-wider transition-colors duration-300
                                                ${isHovered ? "text-signal-green" : "text-muted-foreground"}
                                            `}>
                                                View Specs →
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ================================================================
                SPEC SHEET MODAL (Both Themes)
            ================================================================ */}
            <AnimatePresence>
                {selectedStation && activeStation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedStation(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-xl overflow-hidden shadow-2xl racetrack:bg-carbon-light racetrack:border-signal-green/30"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedStation(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground racetrack:bg-carbon racetrack:border racetrack:border-border racetrack:hover:border-signal-green racetrack:hover:text-signal-green"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-border bg-muted/30 racetrack:bg-carbon">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary racetrack:bg-signal-green/10 racetrack:text-signal-green racetrack:border racetrack:border-signal-green/30 racetrack:rounded-none">
                                        <activeStation.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-1 racetrack:text-signal-green">
                                            {activeStation.designation}
                                        </span>
                                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground racetrack:font-sans racetrack:uppercase racetrack:tracking-tight">
                                            {activeStation.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 space-y-6">
                                {/* Description */}
                                <p className="text-muted-foreground font-sans racetrack:font-mono">
                                    {activeStation.description}
                                </p>

                                {/* Specifications */}
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2 racetrack:text-signal-green racetrack:font-mono">
                                        <Cpu className="w-4 h-4" />
                                        Performance Specs
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {activeStation.specs.map((spec, i) => (
                                            <div
                                                key={i}
                                                className="p-4 bg-muted rounded-lg racetrack:bg-carbon racetrack:border racetrack:border-border racetrack:rounded-none"
                                            >
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 racetrack:font-mono">
                                                    {spec.label}
                                                </div>
                                                <div className="text-foreground font-semibold racetrack:font-mono racetrack:text-signal-green">
                                                    {spec.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Workflow */}
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2 racetrack:text-signal-green racetrack:font-mono">
                                        <Zap className="w-4 h-4" />
                                        Workflow Pipeline
                                    </h4>
                                    <div className="space-y-2">
                                        {activeStation.workflow.map((step, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg racetrack:bg-carbon racetrack:border racetrack:border-border racetrack:rounded-none"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold racetrack:bg-signal-green/20 racetrack:text-signal-green racetrack:rounded-none">
                                                    {i + 1}
                                                </div>
                                                <span className="text-foreground text-sm racetrack:font-mono">
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 md:p-8 border-t border-border bg-muted/30 racetrack:bg-carbon">
                                <button
                                    onClick={() => setSelectedStation(null)}
                                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors racetrack:bg-signal-green racetrack:text-carbon racetrack:rounded-none racetrack:font-mono racetrack:uppercase racetrack:tracking-wider"
                                >
                                    Book This Station
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
