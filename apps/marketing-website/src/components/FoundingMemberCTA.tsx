"use client";

import { motion } from "framer-motion";

interface FoundingMemberCTAProps {
    onOpen: () => void;
}

export function FoundingMemberCTA({ onOpen }: FoundingMemberCTAProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-16 md:py-24 text-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center space-y-4"
            >
                <button
                    onClick={onOpen}
                    className="w-full md:w-auto bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-colors shadow-lg text-sm md:text-base relative overflow-hidden group"
                >
                    <span className="relative z-10">Become a Founding Member</span>
                </button>
                <p className="text-sm font-sans text-black/60 italic">
                    Free for a Limited Time - Limited Spaces Left
                </p>
            </motion.div>
        </div>
    );
}
