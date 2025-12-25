"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, CheckCircle2, AlertCircle, CreditCard, Sparkles } from "lucide-react";
import { Room } from "../data/membershipData";

interface RoomReservationModalProps {
    room: Room | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RoomReservationModal({ room, isOpen, onClose }: RoomReservationModalProps) {
    const [userType, setUserType] = useState<"member" | "guest">("member");
    const [step, setStep] = useState<"details" | "confirmation">("details");

    if (!isOpen || !room) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const isComingSoon = room.comingSoon;
    const isFree = room.isFreeForAll;
    const hasPricing = room.pricing;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
                    >
                        {/* Header Image */}
                        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                            {room.image ? (
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <room.corporateIcon className="w-16 h-16 text-muted-foreground/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="absolute bottom-6 left-6 md:left-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                                        {room.racingCode}
                                    </span>
                                    {isComingSoon && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 backdrop-blur-md">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl font-display font-bold text-foreground">{room.name}</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {isComingSoon ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Opening Soon</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        This space is currently being prepared for our members.
                                        Check back shortly for availability.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {step === "details" ? (
                                        <div className="space-y-8">
                                            {/* Logic Switcher */}
                                            {isFree ? (
                                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-4 items-start">
                                                    <div className="p-2 rounded-full bg-green-500/20 text-green-500 mt-0.5">
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-green-500 mb-1">Free for Everyone</h4>
                                                        <p className="text-sm text-green-500/80">
                                                            This room is available to all members and guests at no cost.
                                                            Reservations are still required to ensure availability.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* User Type Tabs */}
                                                    <div className="flex p-1 bg-muted/50 rounded-lg">
                                                        <button
                                                            onClick={() => setUserType("member")}
                                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === "member"
                                                                    ? "bg-background shadow-sm text-foreground"
                                                                    : "text-muted-foreground hover:text-foreground"
                                                                }`}
                                                        >
                                                            I'm a Member
                                                        </button>
                                                        <button
                                                            onClick={() => setUserType("guest")}
                                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === "guest"
                                                                    ? "bg-background shadow-sm text-foreground"
                                                                    : "text-muted-foreground hover:text-foreground"
                                                                }`}
                                                        >
                                                            I'm a Guest
                                                        </button>
                                                    </div>

                                                    {/* Pricing Table */}
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div className={`p-4 rounded-xl border ${userType === "guest" ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/30 border-border opacity-50"}`}>
                                                            <div className="text-xs uppercase font-mono text-muted-foreground mb-1">Guest</div>
                                                            <div className="text-lg font-bold">{room.pricing?.guest}</div>
                                                        </div>
                                                        <div className={`p-4 rounded-xl border ${userType === "member" ? "bg-muted/50 border-border" : "bg-muted/30 border-border opacity-50"}`}>
                                                            <div className="text-xs uppercase font-mono text-muted-foreground mb-1">Builder</div>
                                                            <div className="text-lg font-bold">{room.pricing?.builder}</div>
                                                        </div>
                                                        <div className={`p-4 rounded-xl border ${userType === "member" ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/30 border-border opacity-50"}`}>
                                                            <div className="text-xs uppercase font-mono text-muted-foreground mb-1">Founder</div>
                                                            <div className="text-lg font-bold">{room.pricing?.founder}</div>
                                                        </div>
                                                    </div>

                                                    {/* Founder Footnote */}
                                                    <div className="flex gap-2 items-start text-xs text-muted-foreground/70 px-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        <p>
                                                            Founder Members receive 10 free reservable-room hours per month (max 2 hours/day).
                                                            After free hours are used, Founder Members pay Builder rates.
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Simulation Inputs */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Date</label>
                                                        <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-background text-sm text-left hover:border-primary/50 transition-colors">
                                                            <span>Today, Oct 24</span>
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Time</label>
                                                        <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-background text-sm text-left hover:border-primary/50 transition-colors">
                                                            <span>2:00 PM (1h)</span>
                                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {userType === "member" && !isFree && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Member ID / Email</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter your Member ID"
                                                                className="w-full p-3 rounded-lg border border-border bg-background text-sm pl-10 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                                            />
                                                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => setStep("confirmation")}
                                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                            >
                                                {isFree ? (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        Confirm Reservation
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-5 h-5" />
                                                        {userType === "member" ? "Reserve Room" : "Continue to Payment"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        // Confirmation Simulation
                                        <div className="text-center py-12 flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Reservation Confirmed!</h3>
                                            <p className="text-muted-foreground mb-8 text-center max-w-sm">
                                                You're booked for the {room.name} on Oct 24 at 2:00 PM. A confirmation email has been sent to you.
                                            </p>
                                            <button
                                                onClick={onClose}
                                                className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
