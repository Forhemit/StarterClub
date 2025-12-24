"use client";

import React from "react";
import { motion } from "framer-motion";
import { typography, colors } from "../tokens";
import { cn } from "../../lib/utils"; // Assuming utils exists in packages/ui/src/lib/utils, typical for shadcn/ui setups. if not we will fix.

interface GlitchTextProps {
    text: string;
    as?: "h1" | "h2" | "h3" | "p" | "span";
    className?: string;
    glitchOnHover?: boolean;
}

export const GlitchText = ({
    text,
    as = "span",
    className,
    glitchOnHover = true
}: GlitchTextProps) => {
    const Component = motion[as as keyof typeof motion] as any; // Type assertion for dynamic motion component

    const hoverVariants = glitchOnHover ? {
        hover: {
            textShadow: [
                `2px 0 ${colors.signal.red}`,
                `-2px 0 ${colors.signal.blue}`,
                `0 0 0 transparent`
            ],
            transition: {
                repeat: Infinity,
                duration: 0.2,
                repeatType: "reverse" as const
            }
        }
    } : {};

    return (
        <Component
            style={{ fontFamily: typography.mono }}
            className={cn("relative inline-block tracking-tight", className)}
            whileHover={glitchOnHover ? "hover" : undefined}
            variants={hoverVariants}
        >
            {text}
        </Component>
    );
};
