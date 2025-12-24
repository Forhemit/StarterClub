"use client";

import React from "react";
import { motion } from "framer-motion";

export function LiveTicker() {
    const tickerItems = [
        "SYSTEM STATUS: ONLINE",
        "ACTIVE MEMBERS: 412",
        "RISKS DETECTED (1H): 14",
        "NEW BUSINESS: [REDACTED] MANUFACTURING (SOMA)",
        "SECURE VAULT: ACTIVE",
        "SIMULATOR: RUNNING SCENARIOS",
        "MARKET STATUS: HIGH VOLATILITY",
    ];

    return (
        <div className="w-full bg-secondary border-y border-border overflow-hidden py-2 relative z-10">
            <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-secondary to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-secondary to-transparent" />

            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-50%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30, // Adjust speed here
                }}
                className="flex whitespace-nowrap"
            >
                {[...tickerItems, ...tickerItems].map((item, index) => (
                    <span
                        key={index}
                        className={`
        inline-block mx-8 text-xs font-mono tracking-widest uppercase
                        ${item.includes("DECAY") ? "text-signal-yellow" : "text-muted-foreground"}
                        ${item.includes("SYSTEM") ? "text-signal-green" : ""}
      `}
                    >
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
