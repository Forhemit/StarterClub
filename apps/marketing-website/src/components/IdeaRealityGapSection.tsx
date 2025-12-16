"use client";

import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";

export function IdeaRealityGapSection() {
    return (
        <section className="w-full py-32 md:py-48 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Column: Image */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full h-[500px] md:h-[600px] rounded-2xl"
                >
                    <Image
                        src="/IdeaRealityGap.png"
                        alt="Turning Ideas Into Reality"
                        fill
                        className="object-contain"
                    />
                </motion.div>

                {/* Right Column: Text */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <h2 className="font-bebas text-5xl md:text-6xl leading-[0.9] text-black uppercase">
                        Turning Ideas<br />Into Reality<br />Starts Here
                    </h2>

                    <p className="font-sans text-lg md:text-xl text-black/80 leading-relaxed font-light">
                        A great idea is only the beginning. But without the right resources, people, and structure, most ideas stall out long before they become something real. At Starter Club, we bridge that gap by giving you the environment, support, and step-by-step foundation you need to launch with confidence. Our facility is free to the community, and our tools and programs are designed to stay low-cost and high-impact.
                    </p>

                    <div className="pt-4">
                        <p className="font-bebas text-2xl md:text-3xl tracking-wide text-black/90">
                            Start strong. Launch smart. Succeed together.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
