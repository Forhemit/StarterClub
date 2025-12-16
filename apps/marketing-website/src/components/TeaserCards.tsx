"use client";

import { Camera, Heart, Settings, SquareKanban } from "lucide-react";
import { motion } from "framer-motion";

const teasers = [
    {
        icon: (
            <div className="relative flex items-center justify-center">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-black" />
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-black absolute -bottom-1 -right-1 fill-white" />
            </div>
        ),
        headline: "Why we exist",
        copy: "Starter Club is San Francisco's launchpad for community creators. We bridge the gap between idea and action, helping neighbors build the projects, businesses, and groups that make our city better.",
    },
    {
        icon: <Camera className="w-8 h-8 md:w-10 md:h-10 text-black" />,
        headline: "Our Goal",
        copy: "Our goal is to build the city’s most supportive launchpad, where anyone can become creators, founders, and opportunity-makers.",
    },
    {
        icon: <SquareKanban className="w-8 h-8 md:w-10 md:h-10 text-black" />,
        headline: "For You",
        copy: "Where you grow your skills, launch your ideas, and strengthen our community.",
    },
];

export function TeaserCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
            {teasers.map((teaser, index) => (
                <TeaserCard key={index} teaser={teaser} delay={index * 0.2} />
            ))}
        </div>
    );
}

function TeaserCard({ teaser, delay }: { teaser: any; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4 group"
        >
            <div className="p-4 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm group-hover:border-[var(--accent)]/50 transition-colors duration-300">
                {teaser.icon}
            </div>
            <h3 className="font-bebas text-2xl md:text-3xl tracking-wide uppercase text-black">
                {teaser.headline}
            </h3>
            <p className="font-sans text-black/70 text-sm md:text-base leading-relaxed max-w-xs">
                {teaser.copy}
            </p>
        </motion.div>
    );
}
