"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { benefitRooms } from "../data/membershipData";
import {
    Users,
    Zap,
    Monitor,
    Mic,
    Coffee,
    ArrowRight,
    Maximize2,
    X,
    Filter,
    ArrowUpAZ,
    ArrowDownAZ,
    DollarSign,
    Clock,
    ChevronDown,
    RotateCcw
} from "lucide-react";

// ============================================================================
// BENEFIT ROOMS SECTION
// Corporate: Premium Hotel / Club Vibe. Clean lines, architectural.
// Racing: Track Facilities Map. Sector-based schematic.
// ============================================================================

import { RoomReservationModal } from "./RoomReservationModal";
import { type Room } from "../data/membershipData";

export function BenefitsRooms() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc" | "availability">("name-asc");
    const [quickFind, setQuickFind] = useState<string>("");

    const ITEMS_PER_PAGE = 4;

    // Reset pagination when category changes
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setQuickFind(""); // Clear quick find
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setQuickFind("");
        setActiveCategory("all");
        setSortBy("name-asc");
        setCurrentPage(1);
    };

    const handleReserve = (room: Room) => {
        if (room.comingSoon || !room.isReservable) return;
        setSelectedRoom(room);
        setIsReservationOpen(true);
    };

    // Derived state for filtered and paginated rooms
    const allRooms = useMemo(() => benefitRooms.flatMap(category => category.rooms), []);

    const filteredRooms = useMemo(() => {
        if (quickFind) {
            return allRooms.filter(r => r.id === quickFind);
        }

        const rooms = activeCategory === "all"
            ? allRooms
            : benefitRooms.find(c => c.id === activeCategory)?.rooms || [];

        return [...rooms].sort((a, b) => {
            const getPrice = (r: Room) => {
                const priceStr = r.pricing?.guest;
                if (!priceStr) return 0;
                return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
            };

            switch (sortBy) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "price-asc":
                    return getPrice(a) - getPrice(b);
                case "price-desc":
                    return getPrice(b) - getPrice(a);
                case "availability":
                    // Free rooms (no pricing) usually considered available/priority here or we can use isFreeForAll
                    // Let's explicitly put free rooms first
                    const aFree = a.isFreeForAll ? 1 : 0;
                    const bFree = b.isFreeForAll ? 1 : 0;
                    return bFree - aFree;
                default:
                    return 0;
            }
        });
    }, [activeCategory, allRooms, sortBy, quickFind]);

    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = filteredRooms.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderButton = (room: Room, variant: "corporate" | "racing") => {
        if (room.isReservable === false) return null;

        if (room.comingSoon) {
            if (variant === "racing") {
                return (
                    <button
                        disabled
                        className="px-3 py-1 bg-muted/10 border border-muted text-muted-foreground text-xs font-mono uppercase cursor-not-allowed opacity-50"
                    >
                        [ OFFLINE ]
                    </button>
                );
            }
            return (
                <button
                    disabled
                    className="px-6 py-2.5 rounded-full bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed opacity-70"
                >
                    Coming Soon
                </button>
            );
        }

        if (variant === "racing") {
            return (
                <button
                    onClick={() => handleReserve(room)}
                    className="px-3 py-1 bg-signal-green/10 border border-signal-green/30 text-signal-green text-xs font-mono uppercase hover:bg-signal-green hover:text-black transition-colors"
                >
                    [ ACCESS ]
                </button>
            );
        }

        return (
            <button
                onClick={() => handleReserve(room)}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
                Reserve Space
            </button>
        );
    };

    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
            <RoomReservationModal
                room={selectedRoom}
                isOpen={isReservationOpen}
                onClose={() => setIsReservationOpen(false)}
            />

            {/* ================================================================
                CORPORATE THEME
            ================================================================ */}
            <div className="block racetrack:hidden relative z-10">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 mb-6">
                            Pillar 3 · The Spaces
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Quietly Elite. Deeply Useful.
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                            A collection of rooms that feel premium without feeling precious.
                            Designed for heads-down execution and serious building.
                        </p>
                    </motion.div>

                    {/* Controls & Filter Bar */}
                    <div className="max-w-7xl mx-auto mb-16 space-y-4">

                        {/* Row 1: Categories */}
                        <div className="flex justify-center w-full">
                            <div className="inline-flex items-center gap-1.5 p-1.5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm overflow-x-auto max-w-full no-scrollbar">
                                <button
                                    onClick={() => handleCategoryChange("all")}
                                    className={`
                                        flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none
                                        ${activeCategory === "all" && !quickFind
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100"
                                            : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                                        }
                                    `}
                                >
                                    All Spaces
                                </button>
                                {benefitRooms.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`
                                            flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none whitespace-nowrap
                                            ${activeCategory === category.id && !quickFind
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100"
                                                : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
                                            }
                                        `}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Row 2: Dropdowns */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-2">

                            {/* Quick Find (Flex Grow) */}
                            <div className="relative group flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                                    <Maximize2 className="w-4 h-4" />
                                </div>
                                <select
                                    value={quickFind}
                                    onChange={(e) => {
                                        setQuickFind(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full h-12 pl-11 pr-10 rounded-xl bg-background/50 hover:bg-background/80 border border-transparent hover:border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    aria-label="Quick find room"
                                >
                                    <option value="" className="text-muted-foreground">Quick Find a Room...</option>
                                    {allRooms
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.name}
                                            </option>
                                        ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </div>
                            </div>

                            {/* Separator (Desktop) */}
                            <div className="hidden md:block w-px h-8 bg-border/50 mx-2" />

                            {/* Sort (Fixed Width) */}
                            <div className="relative md:w-64">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                                    {sortBy.includes('name') && <Filter className="w-3.5 h-3.5" />}
                                    {sortBy.includes('price') && <DollarSign className="w-3.5 h-3.5" />}
                                    {sortBy.includes('availability') && <Clock className="w-3.5 h-3.5" />}
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full h-12 pl-10 pr-10 rounded-xl bg-background/50 hover:bg-background/80 border border-transparent hover:border-border text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    aria-label="Sort rooms"
                                >
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="price-asc">Price (Low-High)</option>
                                    <option value="price-desc">Price (High-Low)</option>
                                    <option value="availability">Availability</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            <button
                                onClick={handleClearFilters}
                                className="h-12 w-12 flex items-center justify-center rounded-xl bg-background/50 hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all group"
                                aria-label="Clear filters"
                                title="Clear all filters"
                            >
                                <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Room Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12 min-h-[600px]">
                        <AnimatePresence mode="popLayout">
                            {paginatedRooms.map((room) => {
                                const Icon = room.corporateIcon;
                                const isFeatured = room.isFeatured;

                                if (isFeatured) {
                                    return (
                                        <motion.div
                                            key={room.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="md:col-span-2 group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500"
                                        >
                                            <div className="flex flex-col md:flex-row h-full">
                                                {/* Content Side */}
                                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                                    <div className="mb-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                                            <Icon className="w-8 h-8" />
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4 tracking-tight">
                                                            {room.name}
                                                        </h3>
                                                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                                                            {room.description}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-8 mt-auto">
                                                        <div className="flex flex-wrap gap-2">
                                                            {room.specs.map((spec, i) => (
                                                                <span key={i} className="px-4 py-1.5 bg-muted/50 border border-border text-sm font-medium rounded-full text-foreground/80">
                                                                    {spec}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-[1px] bg-primary"></div>
                                                                <p className="text-sm font-medium text-primary italic">
                                                                    "{room.vibe}"
                                                                </p>
                                                            </div>
                                                            {renderButton(room, "corporate")}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Image Side */}
                                                <div className="flex-1 relative min-h-[300px] md:min-h-full overflow-hidden">
                                                    {room.image && (
                                                        <img
                                                            src={room.image}
                                                            alt={room.name}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:bg-gradient-to-r md:from-card md:via-card/20 md:to-transparent" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={room.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Icon className="w-32 h-32" />
                                        </div>

                                        <div className="relative z-10 flex-1 flex flex-col">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold font-display text-foreground">
                                                    {room.name}
                                                </h3>
                                            </div>

                                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed min-h-[3rem]">
                                                {room.description}
                                            </p>

                                            <div className="mt-auto space-y-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {room.specs.map((spec, i) => (
                                                        <span key={i} className="px-3 py-1 bg-muted/50 text-xs font-medium rounded-md text-foreground/80">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                                    <p className="text-sm font-medium text-primary italic">
                                                        "{room.vibe}"
                                                    </p>
                                                    {renderButton(room, "corporate")}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <span className="text-sm font-medium text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ================================================================
                RACING THEME
            ================================================================ */}
            <div className="hidden racetrack:block relative z-10 bg-background border-y border-border py-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-border pb-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-signal-green animate-pulse rounded-full" />
                                <span className="font-mono text-xs text-signal-green uppercase tracking-widest">
                                    Facility Schematic
                                </span>
                            </div>
                            <h2 className="font-sans text-4xl md:text-5xl font-bold uppercase tracking-tighter text-foreground">
                                Track Facilities
                            </h2>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="font-mono text-xs text-muted-foreground uppercase">Sector Status</div>
                            <div className="font-mono text-xl text-signal-green">ALL SYSTEMS NOMINAL</div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="space-y-4">
                            {benefitRooms.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`
                                        w-full text-left p-4 border transition-all duration-300
                                        ${activeCategory === category.id
                                            ? "border-signal-green bg-signal-green/10"
                                            : "border-border bg-carbon-light hover:border-signal-green/30"
                                        }
                                    `}
                                >
                                    <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
                                        {category.sectorName}
                                    </div>
                                    <div className={`font-sans font-bold uppercase ${activeCategory === category.id ? "text-signal-green" : "text-foreground"}`}>
                                        {category.title}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Main Display */}
                        <div className="lg:col-span-3 bg-carbon-light border border-border p-1 relative min-h-[500px]">
                            {/* Grid overlay */}
                            <div
                                className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 relative z-10">
                                {paginatedRooms.map((room) => (
                                    <motion.div
                                        key={room.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="border border-border bg-background p-6 hover:border-signal-green transition-colors group cursor-crosshair flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="font-mono text-xs text-signal-green border border-signal-green px-2 py-0.5">
                                                {room.racingCode}
                                            </div>
                                            <Maximize2 className="w-4 h-4 text-muted-foreground group-hover:text-signal-green transition-colors" />
                                        </div>

                                        <h3 className="font-sans text-xl font-bold uppercase text-foreground mb-2">
                                            {room.name}
                                        </h3>
                                        <p className="font-mono text-sm text-muted-foreground mb-6 border-l-2 border-border pl-3 group-hover:border-signal-green transition-colors">
                                            {room.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {room.specs.slice(0, 4).map((spec, i) => (
                                                <div key={i} className="text-[10px] font-mono text-foreground/70 bg-muted/50 px-2 py-1 truncate">
                                                    {spec}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                            <div>
                                                <span className="font-mono text-[10px] text-muted-foreground uppercase block">CAPACITY</span>
                                                <span className="font-mono text-xs text-foreground">{room.capacity}</span>
                                            </div>
                                            {renderButton(room, "racing")}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
