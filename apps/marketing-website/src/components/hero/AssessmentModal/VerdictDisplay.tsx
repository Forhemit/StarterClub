"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { ResultData } from "./types";

interface VerdictDisplayProps {
    result: ResultData;
    score: number;
    totalQuestions: number;
    onCtaClick: () => void;
    onComprehensiveClick?: () => void;
    onRetake: () => void;
}

export const VerdictDisplay: React.FC<VerdictDisplayProps> = ({
    result,
    score,
    totalQuestions,
    onCtaClick,
    onComprehensiveClick,
    onRetake,
}) => {
    const isBrick = result.type === 'brick';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 md:p-10 max-w-2xl w-full bg-background rounded-2xl"
        >
            <div className="text-center space-y-6">
                {/* Result Icon with animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative inline-block w-48 h-48 md:w-56 md:h-56 mb-4 rounded-full overflow-hidden shadow-2xl border-4"
                    style={{ borderColor: `var(--${result.color.replace('text-', '')})` }}
                >
                    <Image src={result.image} alt={result.title} unoptimized fill className="object-cover" />
                    {isBrick && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-4 right-4 bg-background/80 rounded-full p-2"
                        >
                            <Sparkles className="w-6 h-6 text-signal-yellow" />
                        </motion.div>
                    )}
                </motion.div>

                {/* Result Title */}
                <h3 className={`font-heading text-2xl md:text-3xl font-bold ${result.color}`}>
                    {result.title}
                </h3>

                {/* Result Description */}
                <div className={`${result.bgColor} border ${result.borderColor} rounded-2xl p-6 text-left`}>
                    <p className="text-foreground leading-relaxed text-base">
                        {result.reply}
                    </p>
                </div>

                {/* Score Summary */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>
                        You answered YES to {score} of {totalQuestions} questions
                    </span>
                </div>

                {/* Additional insight for brick result */}
                {isBrick && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-signal-green font-medium"
                    >
                        Only 4% of businesses reach this level
                    </motion.div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 mt-6">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={onCtaClick}
                        className="group px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex flex-col items-center justify-center mx-auto min-w-[300px]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold uppercase tracking-wider">{result.ctaText}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="text-xs font-normal opacity-80 mt-1">Take action now</span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={onComprehensiveClick}
                        className="group px-8 py-3 bg-muted border border-border text-foreground rounded-xl hover:bg-muted/80 transition-all flex flex-col items-center justify-center mx-auto min-w-[300px]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold uppercase tracking-wider">Comprehensive Test</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="text-xs font-normal opacity-70 mt-1">12 Questions to pinpoint issues</span>
                    </motion.button>
                </div>

                {/* Retake Button */}
                <button
                    onClick={onRetake}
                    className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                    Retake the Test
                </button>
            </div>
        </motion.div>
    );
};
