"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const benefits = [
    {
        title: "Opportunity",
        quote: "“Doors are opening for me.”",
        description: "Introductions to partners, accelerators, banks, service providers, and sponsors who want to support emerging SF talent.",
        image: "/hero-2.jpeg" // Repeating image 2
    },
    {
        title: "Access",
        quote: "“I can use tools I couldn’t normally afford.”",
        description: "Super Stations, expensive software, camera rooms, creator studios, expert instructors, partners, and discounted Starter Packs.",
        image: "/hero-1.jpeg" // Repeating image 1
    },
    {
        title: "Community",
        quote: "“These are my people.”",
        description: "A tribe of others building things in San Francisco — meaning real relationships, collaborations, and support.",
        image: "/hero-4.jpeg"
    },
    {
        title: "Confidence",
        quote: "“I feel legit.”",
        description: "Professional environment, community support, and structured wins make people feel like real entrepreneurs, not hobbyists.",
        image: "/hero-3.jpeg"
    },
    {
        title: "Momentum",
        quote: "“I’m actually making progress now.”",
        description: "With weekly classes, passport milestones, accountability check-ins, and visible progress on the Milestone Wall, they stay moving.",
        image: "/hero-2.jpeg"
    },
    {
        title: "Clarity",
        quote: "“I finally know what to do next.”",
        description: "Members go from scattered ideas to a step-by-step roadmap, curated resources, and expert guidance.",
        image: "/hero-1.jpeg" // Reusing hero images for now
    }
];

export function BenefitsGrid() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="font-bebas text-4xl md:text-5xl uppercase mb-4">Six Core Benefits of Starter Club</h2>
                <p className="font-sans text-xl text-black/60 max-w-2xl mx-auto">
                    These are the outcomes members feel — not just the features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex flex-col-reverse md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
                    >
                        {/* Content Side */}
                        <div className="flex-1 p-8 flex flex-col justify-center relative">
                            {/* Orange Corner Accent */}
                            <div className="absolute top-0 left-0 w-16 h-1 bg-[var(--accent)]" />
                            <div className="absolute top-0 left-0 w-1 h-16 bg-[var(--accent)]" />

                            <div className="mb-2">
                                <span className="font-bebas text-3xl md:text-4xl block mb-2">{index + 1}. {benefit.title}</span>
                                <span className="font-sans italic text-[var(--accent)] font-medium block mb-4">{benefit.quote}</span>
                            </div>
                            <p className="font-sans text-black/70 leading-relaxed text-sm">
                                {benefit.description}
                            </p>
                        </div>

                        {/* Image Side */}
                        <div className="relative w-full md:w-2/5 h-48 md:h-auto">
                            <Image
                                src={benefit.image}
                                alt={benefit.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
