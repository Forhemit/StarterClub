"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function VisualStoryboard() {
    const panels = [
        {
            id: "crash",
            text: "San Francisco businesses don't die because it wasn't a good idea. They crash because they were not built to last.",
            image: "/business_gravestone_v3.png", // Placeholder
            color: "border-signal-red"
        },
        {
            id: "engine",
            text: "Your idea is the engine.",
            image: "/person_thinking_engine.png", // Placeholder
            color: "border-signal-yellow"
        },
        {
            id: "shocks",
            text: "We help build your business—to not only go faster but to handle the thousands of shocks.",
            image: "/entrepreneur_leading_team.png", // Placeholder
            color: "border-signal-green"
        },
        {
            id: "win",
            text: "So your business can win now and in the future.",
            image: "/race_team_winning.png", // Placeholder
            color: "border-signal-green"
        }
    ];

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {panels.map((panel, index) => (
                <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative group overflow-hidden border ${panel.color} bg-card/50 backdrop-blur-sm rounded-lg`}
                >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <div className="absolute inset-0 bg-muted animate-pulse" /> {/* Loading Placeholder */}
                        {/* 
                            Note: Images will be generated and placed in public/ 
                            Uncomment Image component once images are ready
                        */}
                        <Image
                            src={panel.image}
                            alt={panel.text}
                            fill
                            className="object-cover group-hover:scale-105 transition-all duration-700"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="p-4 relative z-10">
                        <p className="font-mono text-xs md:text-sm text-foreground/90 leading-relaxed min-h-[4rem]">
                            {panel.text}
                        </p>
                    </div>

                    {/* Tech Decorators */}
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        0{index + 1}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
