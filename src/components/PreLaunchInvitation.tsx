"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PreLaunchInvitation() {
    return (
        <section className="w-full py-24 bg-[#0a0a0a] text-white">
            <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* LEFT: Content */}
                <div className="space-y-12">

                    {/* Header */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <h4 className="font-sans text-orange-500 font-bold tracking-widest uppercase text-sm">
                                Exclusive Pre-Launch Invitation
                            </h4>
                            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-tight">
                                February 2026<br />
                                <span className="text-white/40">A First Look for Those Shaping What Comes Next</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-sans text-xl text-white/80 font-light leading-relaxed"
                        >
                            By Invitation Only — A Night for the Builders Behind the Builders.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="font-sans text-white/60 leading-relaxed"
                        >
                            Before the doors open to the public, we’re hosting an intimate evening for the partners, sponsors, and early believers who are helping shape the future of the Starter Club.
                            <br /><br />
                            This isn’t a ribbon-cutting. It’s a gathering of the people who make things happen in San Francisco—the ones who spot sparks early and know how to pour just the right fuel.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Who's Invited */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <h3 className="font-bebas text-3xl tracking-wide text-white">Who’s Invited</h3>
                            <ul className="space-y-4">
                                <li className="space-y-1">
                                    <strong className="block text-white font-sans text-lg">Strategic Partners & Sponsors</strong>
                                    <p className="text-sm text-white/50 font-sans">Those investing in the future of early-stage founders, creators, and the SF innovation ecosystem.</p>
                                </li>
                                <li className="space-y-1">
                                    <strong className="block text-white font-sans text-lg">Foundation Members</strong>
                                    <p className="text-sm text-white/50 font-sans">Our earliest supporters—the brave souls who said “yes” before the paint even dried.</p>
                                </li>
                            </ul>
                        </motion.div>

                        {/* What to Expect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="space-y-6"
                        >
                            <h3 className="font-bebas text-3xl tracking-wide text-white">What to Expect</h3>
                            <ul className="space-y-4 text-sm text-white/60 font-sans list-disc pl-5 marker:text-orange-500">
                                <li><strong className="text-white">A Private Tour</strong> of the full Starter Club campus, including Members-only rooms, Creator Labs, and Super Stations.</li>
                                <li><strong className="text-white">Founder Introductions</strong> — meet a curated group of our first cohort of Starters.</li>
                                <li><strong className="text-white">Drinks, hors d'oeuvres, & smart conversation</strong> — the holy trinity of good decisions.</li>
                                <li><strong className="text-white">A Sneak Reveal</strong>: the programs, partnerships, and opportunities launching in our first 90 days.</li>
                                <li><strong className="text-white">First Pick Access</strong>: early reservation options for events, rooms, and brand placements.</li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Why This Matters / CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="pt-8 border-t border-white/10 space-y-8"
                    >
                        <div>
                            <h3 className="font-bebas text-2xl text-white/80 mb-2">Why This Matters</h3>
                            <p className="font-sans text-white/50 max-w-lg">
                                Because when the doors officially open, momentum will already be moving fast. This is the one moment to stand inside the story before everyone else arrives.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-colors shadow-lg shadow-orange-900/20">
                                Request Your Invitation
                            </button>
                            <p className="text-xs text-white/40 font-sans max-w-xs italic">
                                A limited number of spots are available. Confirm early—your future collaborators will be in the room.
                            </p>
                        </div>
                    </motion.div>

                </div>

                {/* RIGHT: Image */}
                <div className="relative h-[600px] lg:h-[800px] w-full rounded-2xl overflow-hidden">
                    <Image
                        src="/PrelaunchParty.png"
                        alt="Exclusive Pre-Launch Event for Builders"
                        fill
                        className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                    <div className="absolute bottom-12 left-8 md:left-12 right-8">
                        <p className="font-bebas text-4xl md:text-5xl text-white leading-none tracking-wide text-shadow-lg">
                            “Be part of the night where the future begins.”
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
