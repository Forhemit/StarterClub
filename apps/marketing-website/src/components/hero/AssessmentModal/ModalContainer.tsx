"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuizEngine } from "./QuizEngine";
import { QuestionCard } from "./QuestionCard";
import { VerdictDisplay } from "./VerdictDisplay";
import { PILLARS } from "./types";

interface ModalContainerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ isOpen, onClose }) => {
    const {
        state,
        currentQuestion,
        progress,
        result,
        handleStart,
        handleAnswer,
        handleReset,
    } = useQuizEngine();

    // Handle escape key with confirmation if in progress
    const handleEscapeKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
            const hasProgress = state.answers.some(a => a !== null);
            if (hasProgress && state.step !== 'verdict') {
                const confirmed = window.confirm('You have progress in the assessment. Close anyway?');
                if (!confirmed) return;
            }
            handleClose();
        }
    }, [isOpen, state.answers, state.step]);

    useEffect(() => {
        window.addEventListener('keydown', handleEscapeKey);
        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [handleEscapeKey]);

    // Fire analytics when modal opens
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'assessment_started');
        }
    }, [isOpen]);

    const handleClose = () => {
        // Reset if completed, keep progress if in middle
        if (state.step === 'verdict') {
            handleReset();
        }
        onClose();
    };

    const scrollToServices = () => {
        handleClose();
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
            const headerOffset = 80;
            const elementPosition = servicesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl bg-background border-border p-0 overflow-hidden shadow-2xl min-h-[500px] [&>div]:bg-background">
                <DialogHeader className="sr-only">
                    <DialogTitle>Real World Readiness Test</DialogTitle>
                    <DialogDescription>3 questions to assess your business resilience</DialogDescription>
                </DialogHeader>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Content */}
                <div className="flex items-center justify-center min-h-[500px] p-4">
                    <AnimatePresence mode="wait">
                        {/* INTRO STAGE */}
                        {state.step === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-8 md:p-12 text-center space-y-8 max-w-xl"
                            >
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                        className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center"
                                    >
                                        <Target className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                        The Business Resilience Audit
                                    </h2>
                                    <p className="text-primary font-medium italic">
                                        Are You Built to Last?
                                    </p>
                                </div>

                                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                                    Stop guessing. Start knowing. In <span className="text-foreground font-semibold">3 questions</span>, 
                                    discover if your business is built to survive, thrive, and sell.
                                </p>

                                <div className="flex flex-wrap justify-center gap-3 py-4">
                                    {PILLARS.map((pillar, i) => (
                                        <motion.div
                                            key={pillar.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className="px-3 py-1.5 bg-muted/80 rounded-full text-sm text-muted-foreground flex items-center gap-2"
                                        >
                                            <span>{pillar.icon}</span>
                                            <span className="hidden sm:inline">{pillar.name}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    onClick={handleStart}
                                    className="group px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                                >
                                    Start Your Audit
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        )}

                        {/* QUESTION STAGE */}
                        {state.step === 'question' && currentQuestion && (
                            <QuestionCard
                                key={`q-${currentQuestion.id}`}
                                question={currentQuestion}
                                questionNumber={currentQuestion.id}
                                totalQuestions={3}
                                onAnswer={handleAnswer}
                            />
                        )}

                        {/* CALCULATING STAGE */}
                        {state.step === 'calculating' && (
                            <motion.div
                                key="calculating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 text-center space-y-6 flex flex-col items-center justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                                />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-heading text-foreground">Analyzing Your Responses...</h3>
                                    <p className="text-muted-foreground">Calculating your Resilience Score</p>
                                </div>
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-2 h-2 bg-primary rounded-full"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* VERDICT STAGE */}
                        {state.step === 'verdict' && result && (
                            <VerdictDisplay
                                key="verdict"
                                result={result}
                                score={state.score}
                                totalQuestions={3}
                                onCtaClick={scrollToServices}
                                onRetake={handleReset}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};
