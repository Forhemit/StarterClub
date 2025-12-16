"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function InsidersAreaSection() {
    const [activeTab, setActiveTab] = useState<"arsenal" | "why">("arsenal");

    const arsenalItems = [
        {
            emoji: "🧠",
            title: "The Connections Ladder",
            description: "Go beyond networking. Your personal Starter Coach provides curated, warm introductions to the exact people you need to succeed—bankers, legal experts, mentors, potential co-founders, or investors. This is strategic matchmaking designed to accelerate your path.",
        },
        {
            emoji: "⚡",
            title: "Super Stations",
            description: "High-performance Mac and PC workstations loaded with premium software (Adobe CC, Final Cut, Figma, specialized AI tools). Edit, render, build, and prototype on hardware that removes technical limits.",
        },
        {
            emoji: "✨",
            title: "YouTube Creator Studios",
            description: "Purpose-built, sound-treated rooms for filming, interviewing, or launching the channel you've envisioned. Professional lighting, backdrops, and seamless upload connectivity.",
        },
        {
            emoji: "🔧",
            title: "Maker & Workshop Rooms",
            description: "Whiteboards, tools, and collaboration tables to hash out strategy, map milestones, and solve problems with your peers.",
        },
        {
            emoji: "🍽️",
            title: "The Insiders Kitchen & Lounge",
            description: "A private sanctuary to recharge or connect. The most valuable conversations happen here—naturally, over a warm cup.",
        },
        {
            emoji: "☕",
            title: "Unlimited Fuel",
            description: "Your membership includes unlimited espresso, premium coffee, tea, and curated snacks. Breakthroughs are powered here.",
        },
    ];

    const whyItems = [
        {
            title: "Deep Focus",
            description: "A quieter, dedicated environment designed for uninterrupted work.",
        },
        {
            title: "Professional-Grade Tools",
            description: "Access to resources that remove cost-barriers to quality.",
        },
        {
            title: "Velocity",
            description: "Fewer distractions, more momentum. See weeks of progress condensed into days.",
        },
        {
            title: "The Serendipity of Seriousness",
            description: "A community of peers operating at your level of commitment.",
        },
        {
            title: "The Psychological Edge",
            description: "Space that affirms your commitment, making ambition the default.",
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 bg-white">
            <div className="flex flex-col gap-20 md:gap-24">

                {/* ROW 1: SPLIT (TEXT + IMAGE) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Text */}
                    <div className="space-y-6">
                        <div className="space-y-4 mb-8">
                            <h2 className="font-bebas text-4xl md:text-6xl uppercase tracking-tighter text-black leading-none">
                                The Builder's Member Area
                            </h2>
                            <h3 className="font-bebas text-3xl md:text-4xl tracking-wide text-black/60 uppercase">
                                You're done exploring and ready to build something great
                            </h3>
                        </div>

                        <div className="prose prose-xl text-black/70 font-sans leading-relaxed">
                            <p>
                                This is the space reserved for those who have moved beyond the idea. For Builders and Founders, the Insiders Area is the environment where execution becomes instinct, focus is uncompromising, and your venture finds its velocity.
                            </p>
                            <p className="font-bold text-black border-l-4 border-black pl-6 my-6">
                                Step inside the club within the Club. This is where access converts to advantage.
                            </p>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group order-first lg:order-last">
                        <Image
                            src="/MemberAreaInsiders.jpeg"
                            alt="The Insiders Area at Starter Club"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    </div>
                </div>

                {/* ROW 2: TABS */}
                <div className="w-full bg-neutral-50 rounded-2xl p-8 md:p-12 border border-neutral-100 shadow-sm">
                    {/* Tabs Header */}
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 bg-neutral-200/50 p-1.5 rounded-xl mb-12 max-w-2xl">
                        <button
                            onClick={() => setActiveTab("arsenal")}
                            className={`flex-1 py-4 px-6 rounded-lg font-bebas text-xl md:text-2xl tracking-wide transition-all duration-300 ${activeTab === "arsenal"
                                ? "bg-white shadow-md text-black scale-[1.02]"
                                : "text-neutral-500 hover:text-black hover:bg-white/50"
                                }`}
                        >
                            Builders' Arsenal
                        </button>
                        <button
                            onClick={() => setActiveTab("why")}
                            className={`flex-1 py-4 px-6 rounded-lg font-bebas text-xl md:text-2xl tracking-wide transition-all duration-300 ${activeTab === "why"
                                ? "bg-white shadow-md text-black scale-[1.02]"
                                : "text-neutral-500 hover:text-black hover:bg-white/50"
                                }`}
                        >
                            Why It Matters
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "arsenal" ? (
                                <motion.div
                                    key="arsenal"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                                        {arsenalItems.map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-4 group p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-neutral-100">
                                                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300">{item.emoji}</span>
                                                <div>
                                                    <h4 className="font-bebas text-2xl text-black mb-2">{item.title}</h4>
                                                    <p className="text-base text-neutral-600 font-sans leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="why"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-12 max-w-3xl">
                                        <h4 className="font-bebas text-3xl mb-4">Why This Space Changes Everything</h4>
                                        <p className="text-lg text-neutral-600 italic border-l-4 border-accent pl-6">
                                            The Insiders Area isn't a perk; it's a performance accelerator. It signals a shift in intent, providing the tangible environment where "someday" becomes this quarter.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                        {whyItems.map((item, idx) => (
                                            <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                                <h4 className="font-bold font-sans text-lg text-black mb-2">{item.title}</h4>
                                                <p className="text-base text-neutral-600 font-sans">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
}
