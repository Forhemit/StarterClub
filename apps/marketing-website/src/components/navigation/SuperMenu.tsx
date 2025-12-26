"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationBadge } from "./NavigationBadge";
import { navigationData, NavigationSectionData, NavigationItem } from "./navigation-data";
import { trackMenuEvent } from "./analytics";

interface SuperMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Strategic Super Menu - Desktop & Mobile navigation mega menu
 * Follows Antigravity Design Protocol with Luxury/High-Contrast aesthetic.
 * 
 * Features:
 * - Horizontal layout (desktop) / Accordion (mobile)
 * - Physics-based spring animations
 * - Route highlighting
 * - Analytics tracking
 * - Full keyboard navigation
 * - WCAG 2.1 AA compliant
 */
export function SuperMenu({ isOpen, onClose }: SuperMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Toggle accordion section
    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            trackMenuEvent("section_toggle", { sectionId, expanded: !prev.has(sectionId) });
            return newSet;
        });
    };

    // Handle ESC key
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
            trackMenuEvent("menu_close", { method: "escape_key" });
        }
    }, [onClose]);

    // Handle click outside
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            onClose();
            trackMenuEvent("menu_close", { method: "click_outside" });
        }
    }, [onClose]);

    // Track menu open
    useEffect(() => {
        if (isOpen) {
            trackMenuEvent("menu_open", { source: "hamburger_trigger" });
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
            firstFocusableRef.current?.focus();
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown, handleClickOutside]);

    // Check if route is active
    const isActiveRoute = (href: string) => {
        if (href === "/") return pathname === href;
        return pathname.startsWith(href);
    };

    // Handle navigation click with analytics
    const handleNavClick = (item: NavigationItem, sectionId: string) => {
        trackMenuEvent("navigation_click", {
            sectionId,
            itemLabel: item.label,
            itemHref: item.href,
            hasBadge: !!item.badge,
        });
        onClose();
    };

    // Animation variants
    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const menuVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25,
                staggerChildren: 0.03,
                delayChildren: 0.05,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.98,
            transition: {
                duration: 0.15,
                ease: "easeOut",
            },
        },
    };

    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
            },
        },
    };

    const accordionContentVariants: Variants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                height: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.2, delay: 0.1 },
            },
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.1 },
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                        onClick={() => {
                            onClose();
                            trackMenuEvent("menu_close", { method: "backdrop_click" });
                        }}
                    />

                    {/* Menu Panel - Full width on mobile, centered on desktop */}
                    <motion.div
                        ref={menuRef}
                        id="super-menu-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className={`fixed z-50 bg-card/98 backdrop-blur-xl border border-border shadow-2xl shadow-black/20 dark:shadow-black/50
                       ${isMobile
                                ? "top-16 left-0 right-0 bottom-0 overflow-y-auto"
                                : "top-16 left-0 right-0 mx-auto max-w-[1400px] rounded-b-lg"
                            }`}
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Close Button */}
                        <motion.button
                            ref={firstFocusableRef}
                            onClick={() => {
                                onClose();
                                trackMenuEvent("menu_close", { method: "close_button" });
                            }}
                            className="absolute top-4 right-4 p-2 rounded-sm z-10
                         text-muted-foreground hover:text-foreground hover:bg-muted/50
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                         transition-colors"
                            aria-label="Close menu"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>

                        {/* Desktop: Horizontal Layout */}
                        {!isMobile && (
                            <div className="p-6">
                                {/* Horizontal Navigation Grid */}
                                <motion.div
                                    className="grid grid-cols-5 gap-6"
                                    variants={sectionVariants}
                                >
                                    {navigationData.map((section: NavigationSectionData) => (
                                        <motion.div
                                            key={section.id}
                                            className="space-y-3"
                                            variants={sectionVariants}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            {/* Section Header */}
                                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                                <motion.span
                                                    className="w-2 h-2 rounded-full bg-primary"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                                                    {section.label}
                                                </h3>
                                            </div>

                                            {/* Navigation Items */}
                                            <ul className="space-y-1" role="menu">
                                                {section.items.map((item: NavigationItem) => (
                                                    <li key={item.href} role="none">
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => handleNavClick(item, section.id)}
                                                            role="menuitem"
                                                            className={`group flex items-center gap-2 py-2 px-2 -mx-2 rounded-sm text-sm
                                         transition-all duration-150 relative overflow-hidden
                                         focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset
                                         ${isActiveRoute(item.href)
                                                                    ? "bg-primary/10 text-primary font-medium"
                                                                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                                                                }`}
                                                        >
                                                            {/* Active indicator */}
                                                            {isActiveRoute(item.href) && (
                                                                <motion.div
                                                                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"
                                                                    layoutId="activeIndicator"
                                                                    initial={{ scaleY: 0 }}
                                                                    animate={{ scaleY: 1 }}
                                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                                />
                                                            )}

                                                            <motion.span
                                                                className="flex items-center gap-2 flex-1"
                                                                whileHover={{ x: 3 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                            >
                                                                <span className="truncate">{item.label}</span>
                                                                {item.badge && <NavigationBadge variant={item.badge} />}
                                                            </motion.span>

                                                            <ChevronRight
                                                                className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                            />
                                                        </Link>

                                                        {/* Sub Items */}
                                                        {item.subItems && item.subItems.length > 0 && (
                                                            <ul className="ml-3 mt-1 space-y-0.5 border-l border-border/30 pl-2" role="menu">
                                                                {item.subItems.map((subItem: { label: string; href: string }) => (
                                                                    <li key={subItem.href} role="none">
                                                                        <Link
                                                                            href={subItem.href}
                                                                            onClick={() => {
                                                                                trackMenuEvent("navigation_click", {
                                                                                    sectionId: section.id,
                                                                                    itemLabel: subItem.label,
                                                                                    itemHref: subItem.href,
                                                                                    isSubItem: true,
                                                                                });
                                                                                onClose();
                                                                            }}
                                                                            role="menuitem"
                                                                            className={`block py-1 px-2 -mx-2 rounded-sm text-xs font-mono
                                                 transition-all duration-150
                                                 ${isActiveRoute(subItem.href)
                                                                                    ? "text-primary font-medium"
                                                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                                                }`}
                                                                        >
                                                                            {subItem.label}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Bottom Actions Bar */}
                                <motion.div
                                    className="mt-6 pt-4 border-t border-border flex items-center justify-between"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        <span>San Francisco · Building what matters</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/sign-in"
                                            onClick={() => trackMenuEvent("cta_click", { cta: "member_sign_in" })}
                                            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Member Sign In
                                        </Link>
                                        <Link
                                            href="/grid-access"
                                            onClick={() => trackMenuEvent("cta_click", { cta: "join_apply" })}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider
                                 hover:bg-primary/90 transition-all hover:scale-105"
                                        >
                                            Join / Apply
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Mobile: Accordion Layout */}
                        {isMobile && (
                            <div className="p-4 pb-20">
                                <div className="space-y-2">
                                    {navigationData.map((section: NavigationSectionData) => {
                                        const isExpanded = expandedSections.has(section.id);

                                        return (
                                            <motion.div
                                                key={section.id}
                                                className="border border-border/50 rounded-lg overflow-hidden"
                                                variants={sectionVariants}
                                            >
                                                {/* Accordion Header */}
                                                <motion.button
                                                    onClick={() => toggleSection(section.id)}
                                                    className={`w-full flex items-center justify-between p-4 text-left
                                     transition-colors
                                     ${isExpanded ? "bg-muted/50" : "hover:bg-muted/30"}`}
                                                    whileTap={{ scale: 0.99 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <motion.span
                                                            className="w-2 h-2 rounded-full bg-primary"
                                                            animate={isExpanded ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                        <span className="font-sans text-sm font-semibold uppercase tracking-wider">
                                                            {section.label}
                                                        </span>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    </motion.div>
                                                </motion.button>

                                                {/* Accordion Content */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            variants={accordionContentVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="overflow-hidden"
                                                        >
                                                            <ul className="px-4 pb-4 space-y-1" role="menu">
                                                                {section.items.map((item: NavigationItem) => (
                                                                    <li key={item.href} role="none">
                                                                        <Link
                                                                            href={item.href}
                                                                            onClick={() => handleNavClick(item, section.id)}
                                                                            role="menuitem"
                                                                            className={`flex items-center justify-between py-3 px-3 -mx-1 rounded-md
                                                 min-h-[44px] transition-all duration-150
                                                 ${isActiveRoute(item.href)
                                                                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                                                                    : "text-foreground hover:bg-muted/50"
                                                                                }`}
                                                                        >
                                                                            <span className="flex items-center gap-2">
                                                                                <span className="text-sm">{item.label}</span>
                                                                                {item.badge && <NavigationBadge variant={item.badge} />}
                                                                            </span>
                                                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                                        </Link>

                                                                        {/* Sub Items */}
                                                                        {item.subItems && item.subItems.length > 0 && (
                                                                            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-border/30 pl-3" role="menu">
                                                                                {item.subItems.map((subItem: { label: string; href: string }) => (
                                                                                    <li key={subItem.href} role="none">
                                                                                        <Link
                                                                                            href={subItem.href}
                                                                                            onClick={() => {
                                                                                                trackMenuEvent("navigation_click", {
                                                                                                    sectionId: section.id,
                                                                                                    itemLabel: subItem.label,
                                                                                                    itemHref: subItem.href,
                                                                                                    isSubItem: true,
                                                                                                    isMobile: true,
                                                                                                });
                                                                                                onClose();
                                                                                            }}
                                                                                            role="menuitem"
                                                                                            className={`block py-2 px-2 min-h-[44px] flex items-center rounded-md text-sm
                                                         ${isActiveRoute(subItem.href)
                                                                                                    ? "text-primary font-medium"
                                                                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                                                                }`}
                                                                                        >
                                                                                            {subItem.label}
                                                                                        </Link>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Mobile Bottom CTA */}
                                <motion.div
                                    className="mt-6 pt-4 border-t border-border space-y-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        href="/grid-access"
                                        onClick={() => trackMenuEvent("cta_click", { cta: "join_apply", isMobile: true })}
                                        className="block w-full py-3 text-center bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider
                               rounded-lg hover:bg-primary/90 transition-all"
                                    >
                                        Join / Apply
                                    </Link>
                                    <Link
                                        href="/sign-in"
                                        onClick={() => trackMenuEvent("cta_click", { cta: "sign_in", isMobile: true })}
                                        className="block w-full py-3 text-center text-sm font-mono text-muted-foreground hover:text-foreground
                               border border-border rounded-lg transition-colors"
                                    >
                                        Member Sign In
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
