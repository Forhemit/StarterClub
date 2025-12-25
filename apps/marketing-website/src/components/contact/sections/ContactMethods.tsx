"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Wrench,
    Radio,
    Users
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

/**
 * ContactMethods - Section 3: Contact Methods Grid
 * 
 * Corporate Theme (Magazine/Editorial):
 * - Filing system tabs with hanging folders
 * - Rolodex-style circular navigation hint
 * - Office supply palette
 * - Paper shuffle visualization
 * - Rotary phone, mini building model
 * 
 * Racing Theme (Organic/Soft contrast):
 * - Pit bay garage door accordion
 * - Tool wall layout
 * - Toolbox colors
 * - Pneumatic hiss on open
 * - Racing radio, track map
 */

const CONTACT = {
    address: "55 9th Street, San Francisco 94103",
    phone: "(202) 505-3567",
    email: "hello@starterclub.com",
    hours: "Mon-Fri 9AM-6PM PST",
};

const contactMethods = [
    {
        id: "phone",
        label: "Phone",
        icon: Phone,
        value: CONTACT.phone,
        description: "Direct line to our team",
        racingLabel: "RADIO FREQ",
        racingDescription: "Live transmission channel",
    },
    {
        id: "email",
        label: "Email",
        icon: Mail,
        value: CONTACT.email,
        description: "We respond within 24 hours",
        racingLabel: "TELEMETRY",
        racingDescription: "Data upload channel",
    },
    {
        id: "location",
        label: "Visit",
        icon: MapPin,
        value: CONTACT.address,
        description: "Come see us in person",
        racingLabel: "PIT BOX",
        racingDescription: "Garage access point",
    },
    {
        id: "hours",
        label: "Hours",
        icon: Clock,
        value: CONTACT.hours,
        description: "When we're available",
        racingLabel: "SESSION",
        racingDescription: "Track time window",
    },
];

// Pit crew members for racing theme hover effect
const pitCrewMembers = [
    { role: "Crew Chief", name: "Alex", position: "phone" },
    { role: "Engineer", name: "Jordan", position: "email" },
    { role: "Mechanic", name: "Sam", position: "location" },
    { role: "Strategist", name: "Morgan", position: "hours" },
];

export function ContactMethods() {
    const [activeTab, setActiveTab] = useState("phone");
    const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
    const [emailCardThrown, setEmailCardThrown] = useState(false);

    // Handle business card toss animation
    const handleEmailHover = () => {
        if (!emailCardThrown) {
            setEmailCardThrown(true);
            setTimeout(() => setEmailCardThrown(false), 1000);
        }
    };

    return (
        <>
            {/* ========== CORPORATE / LUXURY THEME ========== */}
            <section className="relative py-24 md:py-32 bg-[#f5f1e8] overflow-hidden block racetrack:hidden">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
                }} />

                <div className="relative z-10 container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-syne text-3xl md:text-5xl font-bold text-[#3d2c1a] mb-4">
                            Contact <span className="text-[#b5a642]">Directory</span>
                        </h2>
                        <p className="text-[#3d2c1a]/60 max-w-xl mx-auto">
                            Choose your preferred method of correspondence
                        </p>
                    </motion.div>

                    {/* Filing Cabinet Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            {/* Tab Triggers - Filing Tabs */}
                            <TabsList className="w-full flex justify-center gap-2 bg-transparent h-auto mb-8">
                                {contactMethods.map((method, index) => {
                                    const Icon = method.icon;
                                    const isActive = activeTab === method.id;
                                    return (
                                        <TabsTrigger
                                            key={method.id}
                                            value={method.id}
                                            className="data-[state=active]:bg-transparent bg-transparent p-0"
                                        >
                                            <motion.div
                                                animate={{
                                                    y: isActive ? -12 : 0,
                                                    boxShadow: isActive
                                                        ? "0 12px 30px rgba(0,0,0,0.15)"
                                                        : "0 2px 8px rgba(0,0,0,0.08)",
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="filing-tab relative"
                                                style={{
                                                    background: isActive ? "#f4e4bc" : "#e8d9b8",
                                                    transform: `rotate(${(index - 1.5) * 2}deg)`,
                                                    zIndex: isActive ? 10 : 5 - index,
                                                }}
                                                onMouseEnter={() => method.id === "email" && handleEmailHover()}
                                            >
                                                <div className="flex items-center gap-2 px-4 py-3">
                                                    <Icon className={`w-4 h-4 ${isActive ? "text-[#b5a642]" : "text-[#3d2c1a]/50"}`} />
                                                    <span className={`font-syne text-sm uppercase tracking-wider ${isActive ? "text-[#3d2c1a]" : "text-[#3d2c1a]/60"}`}>
                                                        {method.label}
                                                    </span>
                                                </div>
                                                {/* Brass Fastener */}
                                                <div
                                                    className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-full"
                                                    style={{ background: "linear-gradient(180deg, #d4af37, #b5a642, #8b7d3a)" }}
                                                />
                                            </motion.div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            {/* Tab Content - File Folder */}
                            {contactMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <TabsContent key={method.id} value={method.id} className="mt-0">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={method.id}
                                                initial={{ opacity: 0, y: 20, rotateX: -10 }}
                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                exit={{ opacity: 0, y: -20, rotateX: 10 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white border border-[#d4c4a0] p-8 md:p-12 shadow-lg"
                                            >
                                                <div className="flex flex-col md:flex-row items-center gap-8">
                                                    {/* Icon */}
                                                    <div className="w-24 h-24 rounded-full bg-[#f4e4bc] flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-10 h-10 text-[#b5a642]" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 text-center md:text-left">
                                                        <h3 className="font-syne text-2xl font-bold text-[#3d2c1a] mb-2">
                                                            {method.label}
                                                        </h3>
                                                        <p className="text-[#3d2c1a]/60 mb-4">{method.description}</p>
                                                        <div className="text-xl font-medium text-[#3d2c1a]">
                                                            {method.id === "email" ? (
                                                                <a
                                                                    href={`mailto:${method.value}`}
                                                                    className="hover:text-[#b5a642] transition-colors underline underline-offset-4"
                                                                >
                                                                    {method.value}
                                                                </a>
                                                            ) : method.id === "phone" ? (
                                                                <a
                                                                    href={`tel:${method.value.replace(/\D/g, "")}`}
                                                                    className="hover:text-[#b5a642] transition-colors"
                                                                >
                                                                    {method.value}
                                                                </a>
                                                            ) : (
                                                                method.value
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Visual Element */}
                                                    <div className="hidden lg:block">
                                                        {method.id === "phone" && (
                                                            <div className="w-20 h-20 rounded-full bg-[#222] border-4 border-[#444] flex items-center justify-center relative">
                                                                <div className="absolute inset-4 rounded-full bg-[#111] flex items-center justify-center">
                                                                    <Phone className="w-6 h-6 text-[#b5a642]" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {method.id === "location" && (
                                                            <div className="w-24 h-20 bg-gradient-to-b from-[#ddd] to-[#bbb] border border-[#999] relative">
                                                                {/* Mini building */}
                                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-[#666]">
                                                                    <div className="grid grid-cols-3 gap-0.5 p-1">
                                                                        {[...Array(9)].map((_, i) => (
                                                                            <div key={i} className="w-2 h-2 bg-[#ffeb99]" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>

                        {/* Business Card Toss Animation */}
                        <AnimatePresence>
                            {emailCardThrown && (
                                <motion.div
                                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                                    animate={{
                                        x: [0, 100, 150],
                                        y: [0, -50, 100],
                                        rotate: [0, -30, 15],
                                        opacity: [1, 1, 0]
                                    }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute top-1/2 left-1/2 pointer-events-none z-50"
                                >
                                    <div className="w-32 h-20 bg-white shadow-xl p-2 border border-[#ddd]">
                                        <div className="text-[8px] text-[#3d2c1a] font-bold">STARTER CLUB</div>
                                        <div className="text-[6px] text-[#3d2c1a]/60 mt-1">{CONTACT.email}</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* ========== RACING / PIT GARAGE THEME ========== */}
            <section className="relative py-24 md:py-32 bg-[#1a1a1a] overflow-hidden hidden racetrack:block">
                {/* Tool Wall Grid Background */}
                <div className="absolute inset-0 tool-wall opacity-50" />

                <div className="relative z-10 container mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-bebas text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
                            Garage <span className="text-signal-green">Access</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-jetbrains">
                            Open the bay doors. Multiple channels available.
                        </p>
                    </motion.div>

                    {/* Garage Door Accordion */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <Accordion type="single" collapsible className="space-y-4">
                            {contactMethods.map((method, index) => {
                                const Icon = method.icon;
                                const crewMember = pitCrewMembers.find(c => c.position === method.id);
                                return (
                                    <AccordionItem
                                        key={method.id}
                                        value={method.id}
                                        className="border-0"
                                        onMouseEnter={() => setHoveredMethod(method.id)}
                                        onMouseLeave={() => setHoveredMethod(null)}
                                    >
                                        <AccordionTrigger className="garage-door p-0 hover:no-underline group [&[data-state=open]>div]:bg-signal-green/10">
                                            <div className="w-full p-6 flex items-center gap-4 transition-colors">
                                                {/* Wrench Icon - Rotates when open */}
                                                <div className="w-10 h-10 bg-[#c41e3a] rounded flex items-center justify-center group-data-[state=open]:bg-signal-green transition-colors">
                                                    <Wrench className="w-5 h-5 text-white group-data-[state=open]:wrench-icon-open transition-transform" />
                                                </div>

                                                <div className="flex-1 text-left">
                                                    <div className="font-bebas text-xl text-foreground uppercase tracking-wider">
                                                        {method.racingLabel}
                                                    </div>
                                                    <div className="font-jetbrains text-xs text-muted-foreground">
                                                        {method.racingDescription}
                                                    </div>
                                                </div>

                                                {/* Bay Number */}
                                                <div className="w-12 h-12 border-2 border-signal-green/30 flex items-center justify-center">
                                                    <span className="font-orbitron text-signal-green text-xl">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="bg-black/50 border border-t-0 border-signal-green/20">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-6"
                                            >
                                                {/* Pneumatic Burst Effect */}
                                                <div className="relative">
                                                    <div className="pneumatic-burst absolute -left-4 top-1/2" />
                                                    <div className="pneumatic-burst absolute -right-4 top-1/2" />
                                                </div>

                                                <div className="flex flex-col md:flex-row items-start gap-6">
                                                    {/* Icon */}
                                                    <div className="w-16 h-16 bg-signal-green/10 border border-signal-green/30 flex items-center justify-center">
                                                        <Icon className="w-8 h-8 text-signal-green" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="font-orbitron text-xl text-signal-green mb-2">
                                                            {method.id === "email" ? (
                                                                <a
                                                                    href={`mailto:${method.value}`}
                                                                    className="hover:underline"
                                                                >
                                                                    {method.value}
                                                                </a>
                                                            ) : method.id === "phone" ? (
                                                                <a
                                                                    href={`tel:${method.value.replace(/\D/g, "")}`}
                                                                    className="hover:underline"
                                                                >
                                                                    {method.value}
                                                                </a>
                                                            ) : (
                                                                method.value
                                                            )}
                                                        </div>
                                                        <p className="font-jetbrains text-sm text-muted-foreground">
                                                            {method.racingDescription}
                                                        </p>
                                                    </div>

                                                    {/* Crew Member on Hover */}
                                                    <AnimatePresence>
                                                        {hoveredMethod === method.id && crewMember && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 20 }}
                                                                className="hidden lg:flex items-center gap-3 p-3 bg-signal-green/5 border border-signal-green/20"
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-signal-green/20 flex items-center justify-center">
                                                                    <Users className="w-5 h-5 text-signal-green" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bebas text-foreground">{crewMember.name}</div>
                                                                    <div className="font-jetbrains text-xs text-signal-green">{crewMember.role}</div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Special Elements */}
                                                {method.id === "phone" && (
                                                    <div className="mt-4 flex items-center gap-3 p-3 bg-black/30 border border-signal-red/30">
                                                        <Radio className="w-5 h-5 text-signal-red" />
                                                        <span className="font-jetbrains text-xs text-signal-red">
                                                            LIVE TRANSMISSION AVAILABLE
                                                        </span>
                                                        <motion.div
                                                            animate={{ opacity: [1, 0.5, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                            className="w-2 h-2 rounded-full bg-signal-red ml-auto"
                                                        />
                                                    </div>
                                                )}

                                                {method.id === "location" && (
                                                    <div className="mt-4 p-3 bg-black/30 border border-signal-green/30">
                                                        <div className="font-jetbrains text-xs text-signal-green mb-2">
                                                            PIT BOX COORDINATES
                                                        </div>
                                                        <div className="font-orbitron text-sm text-foreground">
                                                            LAT: 37.7749° N | LNG: 122.4194° W
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
