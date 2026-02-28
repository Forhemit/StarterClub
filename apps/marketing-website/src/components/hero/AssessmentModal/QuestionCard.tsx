"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuestionData } from "./types";

interface QuestionCardProps {
    question: QuestionData;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answer: 'YES' | 'NO') => void;
}

const cardVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
}) => {
    return (
        <motion.div
            key={question.id}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-background rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-border"
            role="region"
            aria-label={`Question ${questionNumber} of ${totalQuestions}`}
        >
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Step {questionNumber} of {totalQuestions}
                </span>
                <div className="flex gap-1">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                i < questionNumber ? "bg-signal-green" : "bg-muted"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-48 md:h-56 mb-8 rounded-xl overflow-hidden shadow-lg border border-border">
                <Image 
                    src={question.image} 
                    alt={question.title}
                    unoptimized
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
                <h3 className="font-heading text-xl text-primary font-bold">
                    {question.title}
                </h3>
            </div>

            {/* Question text */}
            <p className="text-lg text-foreground leading-relaxed text-center mb-8">
                {question.question}
            </p>

            {/* Answer buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAnswer('YES')}
                    className="px-8 py-6 bg-signal-green/10 border-2 border-signal-green text-signal-green font-bold uppercase tracking-wider rounded-xl hover:bg-signal-green/20 transition-all flex items-center justify-center gap-3 group min-h-[72px]"
                    aria-label="Yes"
                >
                    <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>YES</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAnswer('NO')}
                    className="px-8 py-6 bg-muted border-2 border-border text-foreground font-bold uppercase tracking-wider rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-3 group min-h-[72px]"
                    aria-label="No"
                >
                    <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>NO</span>
                </motion.button>
            </div>
        </motion.div>
    );
};
