"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MissionCharterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MissionCharterModal({ isOpen, onClose }: MissionCharterModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#F4F4F0] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-8 md:p-12 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h2 className="font-bebas text-4xl leading-none">
                                            Mission Statement
                                        </h2>
                                        <p className="font-sans text-lg text-black/80 leading-relaxed">
                                            “Starter Club exists to empower the residents of San Francisco with the tools, support, and community they need to start businesses, launch creative work, and build careers that strengthen our city. As a Public Benefit Corporation, our mission is to expand economic mobility by helping everyday people become tomorrow’s creators, operators, and founders.”
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bebas text-3xl leading-none">
                                            Why We Exist
                                        </h3>
                                        <p className="font-sans text-lg text-black/80">
                                            Our PBC exists to:
                                        </p>
                                        <ul className="space-y-3 font-sans text-lg text-black/80 list-disc pl-5">
                                            <li>Help ordinary residents become starters — founders, creators, teachers, operators, builders.</li>
                                            <li>Fuel local economic mobility through low-barrier access to tools, education, and community.</li>
                                            <li>Regenerate San Francisco’s neighborhoods by helping new businesses, new clubs, and new creative ventures take root.</li>
                                            <li>Give people the confidence, roadmaps, and support systems to turn ideas into opportunities.</li>
                                            <li>Ensure this uplift is accessible, not just for the already advantaged.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-8 border-t border-black/10">
                                    <div className="space-y-4">
                                        <h2 className="font-bebas text-4xl leading-none">
                                            Public Benefit Commitments
                                        </h2>
                                        <p className="font-sans text-lg text-black/60">
                                            Core Public Benefits
                                        </p>
                                    </div>

                                    <div className="space-y-8 font-sans">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Economic Mobility</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Deliver programs and tools that help San Francisco residents start businesses, new careers, or income-generating ventures.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Entrepreneurial Pathways</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Provide accessible education, coaching, and “Starter Roadmaps” that guide people from idea → first win → sustainable growth.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Community Revitalization</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Partner with neighborhoods, local organizations, and the City to activate underused spaces, support small businesses, and strengthen local commerce.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Digital & Creative Empowerment</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Offer low-cost or free access to technology, AI tools, creator studios, and professional-grade resources people normally couldn’t afford.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Inclusive Onboarding</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Ensure a portion of programs are accessible to underserved or underrepresented groups in San Francisco’s entrepreneurial ecosystem.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg uppercase tracking-wide">Transparency & Accountability</h3>
                                            <p className="text-black/80 leading-relaxed">
                                                Publish annual public-benefit reports detailing member outcomes, businesses launched, jobs created, partnerships formed, and community impact.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-black/10">
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-black text-white font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-black/80 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
