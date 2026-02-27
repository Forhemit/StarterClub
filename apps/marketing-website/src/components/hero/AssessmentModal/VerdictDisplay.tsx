"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { ResultData } from "./types";

interface VerdictDisplayProps {
    result: ResultData;
    score: number;
    totalQuestions: number;
    onCtaClick: () => void;
    onRetake: () => void;
}

export const VerdictDisplay: React.FC<VerdictDisplayProps> = ({
    result,
    score,
    totalQuestions,
    onCtaClick,
    onRetake,
}) => {
    const isBrick = result.type === 'brick';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 md:p-10 max-w-2xl w-full"
        >
            <div className="text-center space-y-6">
                {/* Result Icon with animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative inline-block"
                >
                    <span className="text-7xl">{result.icon}</span>
                    {isBrick && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="w-8 h-8 text-signal-yellow" />
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

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={onCtaClick}
                    className="group px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all flex items-center gap-3 mx-auto"
                >
                    {result.ctaText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

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
