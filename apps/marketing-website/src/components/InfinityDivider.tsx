"use client";

import React from 'react';
import { motion } from "framer-motion";

export function InfinityDivider() {
    return (
        <div className="w-full flex justify-center py-16 md:py-24 overflow-hidden">
            <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                width="800"
                height="100"
                viewBox="0 0 800 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-4xl h-auto px-4"
            >
                {/* Left Line */}
                <path
                    d="M0 50 L330 50"
                    stroke="black"
                    strokeWidth="1"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Infinity Symbol (Centered at 400, 50) */}
                <path
                    d="M365 50 C365 35 385 30 400 50 C415 70 435 65 435 50 C435 35 415 30 400 50 C385 70 365 65 365 50 Z"
                    stroke="black"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Right Line */}
                <path
                    d="M470 50 L800 50"
                    stroke="black"
                    strokeWidth="1"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.svg>
        </div>
    );
}
