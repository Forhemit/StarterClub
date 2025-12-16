"use client";

import React from 'react';
import { motion } from "framer-motion";
import { MissionCharterModal } from "./MissionCharterModal";
import Image from "next/image";

export function BenefitCorpSection() {
    const [isCharterOpen, setIsCharterOpen] = React.useState(false);

    return (
        <section className="w-full bg-[#e8f5e9] py-24 my-24 md:my-32">
            <MissionCharterModal isOpen={isCharterOpen} onClose={() => setIsCharterOpen(false)} />

            <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h2 className="font-bebas text-4xl md:text-5xl leading-none text-black">
                        We are a Public Benefit Corporation
                    </h2>
                    <div className="font-sans text-lg md:text-xl text-black/80 leading-relaxed font-light space-y-6">
                        <p>
                            As a Public Benefit Corporation, we exist to improve our community by helping residents follow their dreams to become builders of businesses, start a new career, teach a class, start a workshop or start community initiatives that strengthen our city’s social and economic fabric. We provide accessible tools, education, mentorship, and shared spaces that help Starter Club members transform ideas into reality.
                        </p>

                        <button
                            onClick={() => setIsCharterOpen(true)}
                            className="inline-block border-2 border-black px-6 py-2 font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors cursor-pointer"
                        >
                            Read Our Mission Charter
                        </button>
                    </div>
                </motion.div>

                {/* Right Column: Visual/Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex justify-center md:justify-end"
                >
                    <div className="relative w-full max-w-sm aspect-square bg-white rounded-xl flex items-center justify-center border border-black/5 shadow-sm overflow-hidden text-center p-8">
                        <div className="space-y-4">
                            <Image
                                src="/Cartoon-bird-peace-dove-vector.jpg"
                                alt="Starter Club Public Benefit Corporation"
                                width={150}
                                height={150}
                                className="mx-auto"
                            />
                            <h3 className="font-bebas text-2xl">Starter Club is a<br />Public Benefit Corporation</h3>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
