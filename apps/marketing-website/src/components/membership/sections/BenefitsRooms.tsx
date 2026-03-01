"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { benefitRooms } from "../data/membershipData";
import {
    ChevronLeft,
    ChevronRight,
    Users,
    Play,
    Info,
    X,
    Wifi,
    Monitor,
    Mic,
    Video,
    Coffee,
    Armchair,
    Zap,
    Clock,
    Calendar,
} from "lucide-react";
import { RoomReservationModal } from "./RoomReservationModal";
import { type Room } from "../data/membershipData";

// ============================================================================
// NETFLIX-STYLE FLIPPING CARD GALLERY
// Cards flip to show detailed info panel
// ============================================================================

const CARD_WIDTH = 320;
const CARD_HEIGHT = 675;
const CARD_GAP = 24;

export function BenefitsRooms() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    
    const trackRef = useRef<HTMLDivElement>(null);

    // Filter rooms
    const allRooms = benefitRooms.flatMap(category => category.rooms);
    const filteredRooms = React.useMemo(() => {
        if (activeCategory === "all") return allRooms;
        return benefitRooms.find(c => c.id === activeCategory)?.rooms || [];
    }, [activeCategory, allRooms]);

    // Calculate bounds FIRST (needed for useTransform)
    const totalWidth = filteredRooms.length * (CARD_WIDTH + CARD_GAP);
    const maxScroll = Math.max(0, totalWidth - (typeof window !== 'undefined' ? window.innerWidth : 1200) + 200);

    // Motion values for smooth drag
    const x = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    
    // Scroll progress for progress bar (0 to 1) - uses maxScroll which is now defined
    const scrollProgress = useTransform(x, [0, -maxScroll], [0, 1]);
    const progressWidth = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

    // Update arrow visibility
    const updateArrows = useCallback(() => {
        const currentX = x.get();
        setShowLeftArrow(currentX < -10);
        setShowRightArrow(currentX > -maxScroll + 10);
    }, [x, maxScroll]);

    React.useEffect(() => {
        const unsubscribe = x.on("change", updateArrows);
        return unsubscribe;
    }, [x, updateArrows]);

    // Reset when category changes
    React.useEffect(() => {
        x.set(0);
        setFlippedCardId(null);
    }, [activeCategory, x]);

    const handleReserve = (room: Room) => {
        if (room.comingSoon || !room.isReservable) return;
        setSelectedRoom(room);
        setIsReservationOpen(true);
    };

    const handleFlip = (roomId: string) => {
        setFlippedCardId(flippedCardId === roomId ? null : roomId);
    };

    // Scroll handlers
    const scroll = useCallback((direction: "left" | "right") => {
        setFlippedCardId(null);
        const currentX = x.get();
        const scrollAmount = (CARD_WIDTH + CARD_GAP) * 2;
        const targetX = direction === "left" 
            ? Math.min(0, currentX + scrollAmount)
            : Math.max(-maxScroll, currentX - scrollAmount);
        x.set(targetX);
    }, [x, maxScroll]);

    // Wheel handler
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY || e.deltaX;
        const currentX = x.get();
        const newX = Math.max(-maxScroll, Math.min(0, currentX - delta));
        x.set(newX);
    }, [x, maxScroll]);

    // Drag end with momentum
    const handleDragEnd = useCallback((_: any, info: any) => {
        const currentX = x.get();
        const velocity = info.velocity.x;
        const momentum = velocity * 0.2;
        let targetX = currentX + momentum;
        targetX = Math.max(-maxScroll, Math.min(0, targetX));
        const cardPosition = Math.round(-targetX / (CARD_WIDTH + CARD_GAP));
        targetX = -cardPosition * (CARD_WIDTH + CARD_GAP);
        targetX = Math.max(-maxScroll, Math.min(0, targetX));
        x.set(targetX);
    }, [x, maxScroll]);

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            {/* Section Header */}
            <div className="px-4 md:px-8 lg:px-16 mb-8 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-[var(--highlight)]/10 text-[var(--highlight)] mb-3"
                >
                    Space to Build
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--foreground)]"
                >
                    Every room has a purpose
                </motion.h2>
            </div>

            {/* Category Pills */}
            <div className="px-4 md:px-8 lg:px-16 mb-6">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center">
                    <CategoryPill
                        label="All"
                        isActive={activeCategory === "all"}
                        onClick={() => setActiveCategory("all")}
                    />
                    {benefitRooms.map((category) => (
                        <CategoryPill
                            key={category.id}
                            label={category.title}
                            isActive={activeCategory === category.id}
                            onClick={() => setActiveCategory(category.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Gallery Row */}
            <div 
                className="relative group"
                onWheel={handleWheel}
            >
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className={`absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-[var(--background)] to-transparent flex items-center justify-center transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-[var(--background)]/80 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:scale-110 transition-transform">
                        <ChevronLeft className="w-6 h-6" />
                    </div>
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className={`absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-[var(--background)] to-transparent flex items-center justify-center transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-[var(--background)]/80 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:scale-110 transition-transform">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </button>

                {/* Scrollable Track */}
                <motion.div
                    ref={trackRef}
                    className="flex gap-6 px-4 md:px-8 lg:px-16 cursor-grab active:cursor-grabbing"
                    style={{ x: springX }}
                    drag="x"
                    dragConstraints={{ left: -maxScroll, right: 0 }}
                    dragElastic={0.05}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                    onDragEnd={handleDragEnd}
                >
                    {filteredRooms.map((room) => (
                        <FlippingCard
                            key={`${activeCategory}-${room.id}`}
                            room={room}
                            isFlipped={flippedCardId === room.id}
                            onFlip={() => handleFlip(room.id)}
                            onReserve={() => handleReserve(room)}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Scroll Progress Bar */}
            <div className="px-4 md:px-8 lg:px-16 mt-8">
                <div className="max-w-xs mx-auto">
                    <div className="h-1 bg-[var(--muted)]/50 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[var(--highlight)] rounded-full"
                            style={{ width: progressWidth }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-[var(--muted-foreground)]">
                        <span>{filteredRooms.length} rooms</span>
                        <ScrollProgressLabel x={x} maxScroll={maxScroll} totalCards={filteredRooms.length} />
                    </div>
                </div>
            </div>

            {/* Reservation Modal */}
            <RoomReservationModal
                room={selectedRoom}
                isOpen={isReservationOpen}
                onClose={() => setIsReservationOpen(false)}
            />
        </section>
    );
}

// ============================================================================
// Flipping Card Component (Front + Back)
// ============================================================================

function FlippingCard({ 
    room, 
    isFlipped,
    onFlip,
    onReserve 
}: { 
    room: Room; 
    isFlipped: boolean;
    onFlip: () => void;
    onReserve: () => void;
}) {
    return (
        <div className="flex-shrink-0" style={{ width: CARD_WIDTH }}>
            <AnimatePresence mode="wait">
                {!isFlipped ? (
                    <motion.div
                        key="front"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="group/card"
                    >
                        {/* Bordered Container - Card + Actions */}
                        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-3 transition-all duration-300 ease-out hover:border-[var(--highlight)]/50 hover:shadow-2xl hover:shadow-[var(--highlight)]/10 hover:-translate-y-1">
                            {/* Card Image */}
                            <div 
                                className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                                style={{ height: CARD_HEIGHT }}
                                onClick={onFlip}
                            >
                            {/* Background Image/Gradient */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-br from-[var(--highlight)]/20 to-[var(--accent)]/20"
                                style={{
                                    backgroundImage: room.image ? `url(${room.image})` : undefined,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Top Row - Badge & Capacity */}
                                <div className="flex items-start justify-between">
                                    <RoomBadge roomId={room.id} />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{room.capacity}</span>
                                    </div>
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Bottom Section */}
                                <div className="space-y-5">
                                    {/* Title & Code */}
                                    <div>
                                        <h3 className="text-white font-bold text-2xl leading-tight drop-shadow-lg mb-2">
                                            {room.name}
                                        </h3>
                                        <p className="text-white/60 text-sm font-mono">
                                            {room.racingCode}
                                        </p>
                                    </div>

                                    {/* Specs Row */}
                                    <div className="flex flex-wrap gap-2">
                                        {room.specs.slice(0, 3).map((spec, i) => (
                                            <span 
                                                key={i}
                                                className="text-xs px-3 py-1.5 rounded-md bg-white/15 text-white/90 border border-white/10"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Vibe Quote - Bottom strip */}
                            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <p className="text-sm text-white/60 italic truncate">
                                    &ldquo;{room.vibe}&rdquo;
                                </p>
                            </div>
                        </div>
                        
                        {/* Actions BELOW the card - inside border */}
                        <div className="flex items-center gap-3 mt-3 px-1 pb-1">
                            <button
                                onClick={onReserve}
                                disabled={room.comingSoon || !room.isReservable}
                                className="flex-1 py-3 px-4 rounded-lg bg-[var(--highlight)] text-[var(--highlight-foreground)] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 group-hover/card:shadow-lg group-hover/card:shadow-[var(--highlight)]/30"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                {room.comingSoon ? "Coming Soon" : "Reserve Room"}
                            </button>
                            <button 
                                onClick={onFlip}
                                className="w-12 h-12 rounded-full border-2 border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--highlight)] transition-all active:scale-95"
                                aria-label="More information"
                            >
                                <Info className="w-5 h-5" />
                            </button>
                        </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="back"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="group/card"
                    >
                        {/* Bordered Container for Back Card */}
                        <div className="rounded-2xl border-2 border-[var(--highlight)]/30 bg-[var(--card)] p-1 shadow-xl shadow-[var(--highlight)]/5 transition-all duration-300 ease-out">
                            <CardBack 
                                room={room} 
                                onFlip={onFlip}
                                onReserve={onReserve}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// Card Back (Info Panel - Netflix Style)
// ============================================================================

function CardBack({ 
    room, 
    onFlip,
    onReserve 
}: { 
    room: Room; 
    onFlip: () => void;
    onReserve: () => void;
}) {
    return (
        <div 
            className="rounded-xl overflow-hidden bg-[var(--card)] flex flex-col"
            style={{ height: CARD_HEIGHT + 76 }} // Extra height for action buttons
        >
            {/* Header Image with Gradient */}
            <div className="relative h-48 shrink-0">
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-[var(--highlight)]/30 to-[var(--accent)]/30"
                    style={{
                        backgroundImage: room.image ? `url(${room.image})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/80 to-transparent" />
                
                {/* Close Button */}
                <button 
                    onClick={onFlip}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6 right-6">
                    <RoomBadge roomId={room.id} />
                    <h3 className="text-[var(--foreground)] font-bold text-2xl mt-2">
                        {room.name}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm font-mono">
                        {room.racingCode} • {room.capacity}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Description */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                        About this space
                    </h4>
                    <p className="text-[var(--foreground)] text-sm leading-relaxed">
                        {room.description}
                    </p>
                </div>

                {/* Specs Grid */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                        Amenities
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {room.specs.map((spec, i) => (
                            <div 
                                key={i}
                                className="flex items-center gap-2 text-sm text-[var(--foreground)]"
                            >
                                <SpecIcon spec={spec} />
                                <span className="text-xs">{spec}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vibe Quote */}
                <div className="mb-6 p-4 rounded-lg bg-[var(--highlight)]/10 border border-[var(--highlight)]/20">
                    <p className="text-sm text-[var(--highlight)] italic">
                        &ldquo;{room.vibe}&rdquo;
                    </p>
                </div>

                {/* Availability / Pricing Info */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                        Availability
                    </h4>
                    <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                        <span className="text-sm text-[var(--muted-foreground)]">Member Access</span>
                        <span className="text-sm font-medium text-[var(--foreground)]">
                            {room.isReservable ? "Included" : "Contact us"}
                        </span>
                    </div>
                    {room.pricing?.guest && (
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                            <span className="text-sm text-[var(--muted-foreground)]">Guest Rate</span>
                            <span className="text-sm font-medium text-[var(--foreground)]">
                                {room.pricing.guest}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--border)] bg-[var(--muted)]/30 space-y-3">
                <button
                    onClick={onReserve}
                    disabled={room.comingSoon || !room.isReservable}
                    className="w-full py-3 px-4 rounded-lg bg-[var(--highlight)] text-[var(--highlight-foreground)] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
                >
                    <Calendar className="w-4 h-4" />
                    {room.comingSoon ? "Coming Soon" : "Book This Room"}
                </button>
                <button
                    onClick={onFlip}
                    className="w-full py-2 px-4 rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--muted)]/80 transition-all"
                >
                    <X className="w-4 h-4" />
                    Back to Gallery
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// Spec Icon Helper
// ============================================================================

function SpecIcon({ spec }: { spec: string }) {
    const lowerSpec = spec.toLowerCase();
    
    if (lowerSpec.includes("wifi") || lowerSpec.includes("internet")) {
        return <Wifi className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("monitor") || lowerSpec.includes("screen") || lowerSpec.includes("display")) {
        return <Monitor className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("mic") || lowerSpec.includes("audio")) {
        return <Mic className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("camera") || lowerSpec.includes("video")) {
        return <Video className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("coffee") || lowerSpec.includes("tea")) {
        return <Coffee className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("chair") || lowerSpec.includes("seating")) {
        return <Armchair className="w-4 h-4 text-[var(--highlight)]" />;
    }
    if (lowerSpec.includes("hour") || lowerSpec.includes("time")) {
        return <Clock className="w-4 h-4 text-[var(--highlight)]" />;
    }
    
    return <Zap className="w-4 h-4 text-[var(--highlight)]" />;
}

// ============================================================================
// Scroll Progress Label - Shows current position
// ============================================================================

function ScrollProgressLabel({ 
    x, 
    maxScroll, 
    totalCards 
}: { 
    x: ReturnType<typeof useMotionValue<number>>; 
    maxScroll: number;
    totalCards: number;
}) {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    
    // Calculate position based on scroll value
    const calculatePosition = useCallback((currentX: number) => {
        if (maxScroll <= 0) {
            setCurrentIndex(1);
            setIsEnd(totalCards <= 1);
            return;
        }
        
        const progress = Math.abs(currentX) / maxScroll;
        // Calculate which card is at the left edge (1-indexed)
        const cardPosition = Math.floor(progress * totalCards) + 1;
        const clampedIndex = Math.min(cardPosition, totalCards);
        
        setCurrentIndex(clampedIndex);
        setIsEnd(progress >= 0.95 || clampedIndex >= totalCards);
    }, [maxScroll, totalCards]);
    
    // Set initial value on mount
    React.useEffect(() => {
        calculatePosition(x.get());
    }, [calculatePosition, x]);
    
    // Subscribe to changes
    React.useEffect(() => {
        const unsubscribe = x.on("change", calculatePosition);
        return unsubscribe;
    }, [x, calculatePosition]);
    
    if (isEnd) return <span>End of list</span>;
    return <span>{currentIndex} of {totalCards}</span>;
}

// ============================================================================
// Category Pill
// ============================================================================

function CategoryPill({ 
    label, 
    isActive, 
    onClick 
}: { 
    label: string; 
    isActive: boolean; 
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                    ? "bg-[var(--highlight)] text-[var(--highlight-foreground)]"
                    : "bg-[var(--muted)]/50 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
        >
            {label}
        </button>
    );
}

// ============================================================================
// Room Badge
// ============================================================================

function RoomBadge({ roomId }: { roomId: string }) {
    const badgeConfig: Record<string, { label: string; bg: string }> = {
        "room-build": { label: "Focus Zone", bg: "bg-emerald-500" },
        "room-strategy": { label: "Strategy", bg: "bg-blue-500" },
        "room-lab": { label: "Maker Lab", bg: "bg-amber-500" },
        "room-money": { label: "War Room", bg: "bg-green-600" },
        "room-crunch": { label: "Deep Work", bg: "bg-violet-500" },
        "room-create": { label: "Creator Studio", bg: "bg-pink-500" },
        "room-podcast": { label: "Podcast Lab", bg: "bg-purple-500" },
        "room-stream": { label: "Stream Room", bg: "bg-red-500" },
        "room-zoom": { label: "Zoom Booth", bg: "bg-cyan-500" },
        "room-deal": { label: "Deal Room", bg: "bg-indigo-500" },
        "room-board": { label: "Board Room", bg: "bg-slate-600" },
        "room-legal": { label: "Legal Lab", bg: "bg-stone-500" },
        "room-recharge": { label: "Recharge", bg: "bg-teal-500" },
        "room-nap": { label: "Nap Pod", bg: "bg-sky-400" },
        "room-speaker": { label: "Speaker", bg: "bg-orange-500" },
        "room-event": { label: "Event Hall", bg: "bg-rose-500" },
    };

    const config = badgeConfig[roomId] || { label: "Room", bg: "bg-gray-500" };

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${config.bg}`}>
            {config.label}
        </span>
    );
}
