"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Clock,
    Key,
    Radio,
    Gauge,
    Circle,
    Users,
    Headphones
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * ContactAvailability - Section 5: Team Availability / Live Status
 * 
 * Corporate Theme (Brutalist industrial display):
 * - Factory control panel aesthetic
 * - Physical status bulbs behind glass
 * - Analog gauges for response time
 * - Employee badges that flip
 * - Key switch for after-hours override
 * 
 * Racing Theme (Cyber-Physical dashboard):
 * - Pit wall timing screen
 * - Multiple telemetry layers
 * - Driver/crew chief pairs
 * - Tyre wear as response availability
 * - RPM-style indicators
 */

// Team availability data (simulated)
const teamMembers = [
    {
        id: 1,
        name: "Alex Chen",
        role: "Operations Lead",
        status: "available",
        responseTime: 15, // minutes
        racingRole: "Crew Chief",
    },
    {
        id: 2,
        name: "Jordan Park",
        role: "Client Success",
        status: "available",
        responseTime: 30,
        racingRole: "Race Engineer",
    },
    {
        id: 3,
        name: "Sam Rivera",
        role: "Technical Support",
        status: "busy",
        responseTime: 45,
        racingRole: "Mechanic",
    },
    {
        id: 4,
        name: "Morgan Lee",
        role: "Strategy",
        status: "away",
        responseTime: 120,
        racingRole: "Strategist",
    },
];

// Status configurations
const statusConfig = {
    available: { color: "green", label: "Ready", tyreWear: 95 },
    busy: { color: "yellow", label: "In Session", tyreWear: 60 },
    away: { color: "red", label: "Offline", tyreWear: 20 },
};

// Business hours
const businessHours = {
    start: 9,
    end: 18,
    timezone: "PST",
};

export function ContactAvailability() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isBusinessHours, setIsBusinessHours] = useState(false);
    const [keyActivated, setKeyActivated] = useState(false);
    const [selectedMember, setSelectedMember] = useState<number | null>(null);
    const [overallAvailability, setOverallAvailability] = useState(75);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            const hour = now.getHours();
            const isOpen = hour >= businessHours.start && hour < businessHours.end;
            setIsBusinessHours(isOpen);

            // Update overall availability with some randomness
            setOverallAvailability(prev => {
                const delta = (Math.random() - 0.5) * 10;
                return Math.max(20, Math.min(100, prev + delta));
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available": return "bg-green-500";
            case "busy": return "bg-yellow-500";
            case "away": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <>
            {/* ========== CORPORATE / FACTORY CONTROL THEME ========== */}
            <section className="relative py-24 md:py-32 bg-[#4a4a4a] overflow-hidden block racetrack:hidden">
                {/* Industrial Texture */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 10px,
                            rgba(0,0,0,0.1) 10px,
                            rgba(0,0,0,0.1) 11px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 10px,
                            rgba(0,0,0,0.1) 10px,
                            rgba(0,0,0,0.1) 11px
                        )
                    `,
                }} />

                <div className="relative z-10 container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-chakra text-3xl md:text-5xl font-bold text-white mb-4">
                            Operations <span className="text-[#ffd000]">Status</span>
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto">
                            Real-time availability of our support infrastructure
                        </p>
                    </motion.div>

                    {/* Control Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto control-panel p-8"
                    >
                        {/* Main Status Display */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {/* Current Time */}
                            <div className="bg-black/50 p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-[#ffd000]" />
                                    <span className="text-white/50 text-xs uppercase tracking-widest">Local Time</span>
                                </div>
                                <div className="font-space-mono text-2xl text-white tabular-nums">
                                    {formatTime(currentTime)}
                                </div>
                                <div className="text-xs text-white/30 mt-1">{businessHours.timezone}</div>
                            </div>

                            {/* Business Hours Status */}
                            <div className="bg-black/50 p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-[#ffd000]" />
                                    <span className="text-white/50 text-xs uppercase tracking-widest">Office Status</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`status-bulb ${isBusinessHours ? "green" : "red"}`} />
                                    <span className="font-space-mono text-xl text-white">
                                        {isBusinessHours ? "OPEN" : "CLOSED"}
                                    </span>
                                </div>
                                <div className="text-xs text-white/30 mt-1">
                                    {businessHours.start}AM - {businessHours.end > 12 ? businessHours.end - 12 : businessHours.end}PM
                                </div>
                            </div>

                            {/* Response Gauge */}
                            <div className="bg-black/50 p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Gauge className="w-4 h-4 text-[#ffd000]" />
                                    <span className="text-white/50 text-xs uppercase tracking-widest">Capacity</span>
                                </div>
                                <div className="analog-gauge mx-auto">
                                    <div
                                        className="gauge-needle"
                                        style={{
                                            transform: `rotate(${-90 + (overallAvailability / 100) * 180}deg)`
                                        }}
                                    />
                                    <div className="gauge-center" />
                                </div>
                                <div className="text-center font-space-mono text-sm text-white mt-1">
                                    {Math.round(overallAvailability)}%
                                </div>
                            </div>
                        </div>

                        {/* Team Roster */}
                        <div className="mb-8">
                            <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Team Roster</div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {teamMembers.map((member) => {
                                    const status = statusConfig[member.status as keyof typeof statusConfig];
                                    const isSelected = selectedMember === member.id;
                                    return (
                                        <motion.div
                                            key={member.id}
                                            onClick={() => setSelectedMember(isSelected ? null : member.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`employee-badge cursor-pointer transition-all ${isSelected ? "ring-2 ring-[#ffd000]" : ""}`}
                                        >
                                            <div className="badge-flip">
                                                {/* Front - Name & Role */}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                                                        {member.name.split(" ").map(n => n[0]).join("")}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-chakra text-gray-800 font-medium">{member.name}</div>
                                                        <div className="text-gray-500 text-sm">{member.role}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`status-bulb ${status.color}`} />
                                                        <span className="text-xs text-gray-600">{status.label}</span>
                                                    </div>
                                                </div>

                                                {/* Response Time */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="mt-4 pt-4 border-t border-gray-200"
                                                        >
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-500">Avg. Response</span>
                                                                <span className="font-space-mono text-gray-800">{member.responseTime} min</span>
                                                            </div>
                                                            <Progress
                                                                value={100 - (member.responseTime / 120 * 100)}
                                                                className="h-2 mt-2"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* After-Hours Override */}
                        <div className="border-t border-white/10 pt-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <div className="text-white/50 text-xs uppercase tracking-widest mb-1">After-Hours Contact</div>
                                    <div className="text-white text-sm">
                                        {keyActivated
                                            ? "Emergency line activated. We'll respond within 1 hour."
                                            : "Turn the key for urgent after-hours support."
                                        }
                                    </div>
                                </div>
                                <button
                                    onClick={() => setKeyActivated(!keyActivated)}
                                    className={`key-switch ${keyActivated ? "activated" : ""}`}
                                    aria-label="Toggle after-hours override"
                                >
                                    <Key className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${keyActivated ? "text-[#ffd000]" : "text-gray-500"}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACING / TELEMETRY THEME ========== */}
            <section className="relative py-24 md:py-32 bg-black overflow-hidden hidden racetrack:block">
                {/* Scanlines */}
                <div className="absolute inset-0 crt-scanlines opacity-30" />

                <div className="relative z-10 container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-orbitron text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4">
                            Pit Wall <span className="text-signal-green">Status</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-jetbrains">
                            Real-time crew availability. All systems green.
                        </p>
                    </motion.div>

                    {/* Telemetry Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Main Telemetry Screen */}
                        <div className="telemetry-screen p-6 mb-6">
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                {/* Session Clock */}
                                <div className="p-4 bg-black/30 border border-signal-green/20">
                                    <div className="text-signal-green/70 text-xs font-mono uppercase mb-1">Session Time</div>
                                    <div className="font-orbitron text-3xl text-signal-green tabular-nums">
                                        {formatTime(currentTime)}
                                    </div>
                                </div>

                                {/* Track Status */}
                                <div className="p-4 bg-black/30 border border-signal-green/20">
                                    <div className="text-signal-green/70 text-xs font-mono uppercase mb-1">Track Status</div>
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className={`w-4 h-4 rounded-full ${isBusinessHours ? "bg-signal-green" : "bg-signal-red"}`}
                                        />
                                        <span className="font-orbitron text-xl text-foreground">
                                            {isBusinessHours ? "GREEN FLAG" : "RED FLAG"}
                                        </span>
                                    </div>
                                </div>

                                {/* Team Capacity */}
                                <div className="p-4 bg-black/30 border border-signal-green/20">
                                    <div className="text-signal-green/70 text-xs font-mono uppercase mb-1">Crew Capacity</div>
                                    <div className="rpm-telemetry">
                                        <div
                                            className="rpm-indicator"
                                            style={{ left: `${overallAvailability}%` }}
                                        />
                                    </div>
                                    <div className="font-orbitron text-lg text-signal-green mt-2">
                                        {Math.round(overallAvailability)}%
                                    </div>
                                </div>
                            </div>

                            {/* Crew Status Grid */}
                            <div className="border-t border-signal-green/20 pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4 text-signal-green" />
                                    <span className="font-jetbrains text-sm text-signal-green uppercase tracking-widest">Crew Roster</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {teamMembers.map((member) => {
                                        const status = statusConfig[member.status as keyof typeof statusConfig];
                                        return (
                                            <motion.div
                                                key={member.id}
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-4 p-4 bg-black/30 border border-signal-green/10 hover:border-signal-green/30 transition-colors"
                                            >
                                                {/* Radio Status Icon */}
                                                <div className="relative">
                                                    <Headphones className="w-8 h-8 text-signal-green/50" />
                                                    <motion.div
                                                        animate={{ scale: member.status === "available" ? [1, 1.2, 1] : 1 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(member.status)}`}
                                                    />
                                                </div>

                                                {/* Member Info */}
                                                <div className="flex-1">
                                                    <div className="font-bebas text-lg text-foreground uppercase">{member.name}</div>
                                                    <div className="font-jetbrains text-xs text-signal-green">{member.racingRole}</div>
                                                </div>

                                                {/* Tyre Wear Indicator */}
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground mb-1">Response</div>
                                                    <div className="tyre-wear">
                                                        {[...Array(5)].map((_, i) => {
                                                            const threshold = (i + 1) * 20;
                                                            const isActive = status.tyreWear >= threshold;
                                                            let wearClass = "good";
                                                            if (status.tyreWear < 40) wearClass = "worn";
                                                            else if (status.tyreWear < 70) wearClass = "medium";
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`tyre-wear-segment ${isActive ? wearClass : ""}`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Radio Status Bar */}
                        <div className="flex items-center justify-between p-4 bg-signal-green/10 border border-signal-green/30">
                            <div className="flex items-center gap-3">
                                <Radio className="w-5 h-5 text-signal-green" />
                                <span className="font-jetbrains text-sm text-signal-green uppercase tracking-widest">
                                    Team Radio
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-signal-green"
                                />
                                <span className="font-jetbrains text-xs text-foreground">
                                    {isBusinessHours ? "RECEIVING" : "STANDBY"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
