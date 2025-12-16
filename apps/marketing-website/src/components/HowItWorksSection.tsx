"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Compass, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HowItWorksSection() {
    const phases = [
        {
            id: 1,
            title: "Phase 1: The First Onboarding",
            subtitle: "Getting up to speed fast",
            icon: <Compass className="w-8 h-8 text-[var(--accent)]" />,
            content: (
                <div className="space-y-4 text-neutral-600">
                    <p className="font-medium text-black">
                        This is not intake paperwork. It’s orientation + validation.
                    </p>
                    <div className="space-y-2">
                        <h4 className="font-bold text-black text-sm uppercase tracking-wide">
                            1. Lightweight Starter Snapshot
                        </h4>
                        <p className="text-sm">
                            We ask better questions: What are you working toward? What stage
                            are you in? What’s blocking you? This gives us a shared language
                            for your journey.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-black text-sm uppercase tracking-wide">
                            2. Intent-Based Orientation
                        </h4>
                        <p className="text-sm">
                            Instead of a generic tour, we guide you to spaces based on your
                            goals: "Mapping an idea? Commons. Producing? Focus Zone."
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 2,
            title: "Phase 2: Every Check-In Is a Mini Reset",
            subtitle: "Where you truly differentiate",
            icon: <CheckCircle2 className="w-8 h-8 text-[var(--accent)]" />,
            content: (
                <div className="space-y-4 text-neutral-600">
                    <p className="font-medium text-black">
                        The Check-In Question: "What are you hoping to accomplish while
                        you’re here today?"
                    </p>
                    <ul className="space-y-2 text-sm list-disc pl-4 marker:text-[var(--accent)]">
                        <li>Re-centers you on outcomes</li>
                        <li>Gives staff permission to guide</li>
                        <li>Creates continuity across visits</li>
                    </ul>
                    <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 italic text-sm">
                        "Sounds like you need focus today. I'd recommend starting in the
                        Deep Work zone."
                    </div>
                </div>
            ),
        },
        {
            id: 3,
            title: "Phase 3: The Workflow Layer",
            subtitle: "Why this isn’t just vibes",
            icon: <Cpu className="w-8 h-8 text-[var(--accent)]" />,
            content: (
                <div className="space-y-4 text-neutral-600">
                    <p className="font-medium text-black">
                        Behind the scenes, we're doing pattern recognition to help you grow.
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="text-[var(--accent)] font-bold">→</span>
                            <span>Who keeps circling the same blocker?</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[var(--accent)] font-bold">→</span>
                            <span>Who’s ready for the Builder → Founder transition?</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[var(--accent)] font-bold">→</span>
                            <span>Who needs tools vs. people vs. structure?</span>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-black pt-2">
                        This is where coworking spaces stop. This is where Starter Club
                        starts.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white">
            {/* SECTION HEADER */}
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="font-bebas text-5xl md:text-7xl text-black uppercase leading-[0.9]">
                        How Starter Club Works
                    </h2>
                    <p className="font-bebas text-2xl md:text-3xl text-[var(--accent)] mt-4 uppercase tracking-wide">
                        We don’t sell desks. We sell momentum.
                    </p>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg md:text-xl text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto"
                >
                    Every onboarding and every check-in answers two questions: <br />
                    <span className="font-bold text-black">
                        "Where are you in your journey right now?"
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-black">
                        "What would make today a win?"
                    </span>
                </motion.p>
            </div>

            {/* PHASES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
                {/* Connector Line (Desktop Only) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-neutral-100 -z-10" />

                {phases.map((phase, index) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col h-full bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 p-8 group"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-neutral-100">
                                {phase.icon}
                            </div>
                            <h3 className="font-bebas text-3xl text-black mb-2 leading-none">
                                {phase.title}
                            </h3>
                            <p className="font-sans text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                                {phase.subtitle}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex-grow font-sans">{phase.content}</div>
                    </motion.div>
                ))}
            </div>

            {/* SUMMARY BLOCK */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-neutral-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    {/* Abstract decorative pattern can be added here or just rely on bg color */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px]" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <div>
                        <h3 className="font-bebas text-4xl md:text-6xl uppercase tracking-wider mb-6">
                            Intentional by Design
                        </h3>
                        <p className="font-sans text-lg md:text-xl text-neutral-300 leading-relaxed">
                            We don’t believe in one-size-fits-all coworking. Every Starter
                            arrives at a different stage—and every visit has a purpose. From
                            your first day to every check-in after, we help you orient around
                            what you want to accomplish and guide you to the space, tools,
                            and people that support that goal.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="#waitlist"
                            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-bebas text-xl tracking-wide px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Ready to find your momentum? Join Starter Club
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
