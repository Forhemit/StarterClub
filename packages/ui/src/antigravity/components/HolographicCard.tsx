"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { colors, typography } from "../tokens";
import { animations } from "../animations";
import { cn } from "../../lib/utils";

interface HolographicCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    padding?: "none" | "sm" | "md" | "lg";
    className?: string;
    style?: React.CSSProperties;
}

export const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
    ({ children, className, padding = "md", style, ...props }, ref) => {

        const paddingMap = {
            none: 0,
            sm: "1rem",
            md: "2rem",
            lg: "3rem",
        };

        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate="visible"
                variants={animations.slideIn}
                style={{
                    ...style,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${colors.glassBorder}`,
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    padding: paddingMap[padding],
                }}
                className={cn(
                    "relative overflow-hidden rounded-none border-l-2",
                    className
                )}
                {...props}
            >
                {/* Neon Accent Line */}
                <div
                    className="absolute left-0 top-0 h-full w-[2px]"
                    style={{ background: colors.signal.green, boxShadow: `0 0 10px ${colors.signal.green}` }}
                />

                {/* Scanning Line Animation (Optional, simplified here) */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(0, 255, 157, .3) 25%, rgba(0, 255, 157, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 157, .3) 75%, rgba(0, 255, 157, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 157, .3) 25%, rgba(0, 255, 157, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 157, .3) 75%, rgba(0, 255, 157, .3) 76%, transparent 77%, transparent)",
                        backgroundSize: "50px 50px",
                    }}
                />

                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        );
    }
);

HolographicCard.displayName = "HolographicCard";
