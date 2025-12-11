"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PartnersModal } from "./PartnersModal";

export function PartnersSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<"why-partner" | "partners-seek" | "inquiry">("inquiry");

    const openModal = (tab: "why-partner" | "partners-seek" | "inquiry") => {
        setModalTab(tab);
        setIsModalOpen(true);
    };

    return (
        <section className="w-full relative py-20 px-6">
            <PartnersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab={modalTab} />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

                {/* COLUMN 1: Text Content */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="font-bebas text-5xl md:text-6xl uppercase tracking-tight">
                            Partners & Sponsors
                        </h2>
                        <div className="w-16 h-1 bg-black" />
                        <p className="font-bebas text-xl md:text-2xl uppercase tracking-widest text-black/60">
                            By Invitation Only — For Those Building the Future of San Francisco
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="font-sans text-lg font-light leading-relaxed">
                            Your presence here is no coincidence. It signals that you believe—as we do—that San Francisco thrives when its Starters thrive.
                        </p>
                        <p className="font-sans text-base text-black/70 leading-relaxed">
                            We extend this invitation to a select circle of organizations ready to directly empower the next generation of founders. At Starter Club, we guide early-stage entrepreneurs from idea → foundation → first wins.
                        </p>
                    </motion.div>
                </div>

                {/* COLUMN 2: Image */}
                <div className="h-full min-h-[400px] lg:min-h-[600px] relative rounded-2xl overflow-hidden bg-gray-100">
                    {/* Using a standard img tag first to debug if next/image has issues, or just standard next/image */}
                    <img
                        src="/PartnersSponsors2.png"
                        alt="Partners and Sponsors"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay for text readability if needed, or just pure image */}
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* COLUMN 3: Interactive Buttons */}
                <div className="flex flex-col gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#f4f4f0] p-8 md:p-10 text-center space-y-4 cursor-pointer border-2 border-transparent hover:border-black/5 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-center min-h-[250px]"
                        onClick={() => openModal("why-partner")}
                    >
                        <h3 className="font-bebas text-4xl underline decoration-2 underline-offset-4 decoration-black/20 group-hover:decoration-black">
                            Why Partner With Us?
                        </h3>
                        <p className="text-black/60 font-sans text-sm">
                            Visible, meaningful, and measurable impact.
                        </p>
                        <div className="inline-flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-wider opacity-60">
                            Read Benefits <ArrowRight className="w-3 h-3" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#f4f4f0] p-8 md:p-10 text-center space-y-4 cursor-pointer border-2 border-transparent hover:border-black/5 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-center min-h-[250px]"
                        onClick={() => openModal("partners-seek")}
                    >
                        <h3 className="font-bebas text-4xl underline decoration-2 underline-offset-4 decoration-black/20 group-hover:decoration-black">
                            The Partners We Seek
                        </h3>
                        <p className="text-black/60 font-sans text-sm">
                            See if your values align with ours.
                        </p>
                        <div className="inline-flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-wider opacity-60">
                            View Criteria <ArrowRight className="w-3 h-3" />
                        </div>
                    </motion.div>

                    <div className="pt-6 border-t border-black/5">
                        <button
                            onClick={() => openModal("inquiry")}
                            className="w-full bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-4 px-6 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg text-sm md:text-base"
                        >
                            Request an Invitation <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-xs uppercase tracking-widest text-black/40 mt-3 text-center">
                            Start the conversation today.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
