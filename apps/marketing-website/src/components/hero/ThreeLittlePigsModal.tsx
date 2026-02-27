"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ThreeLittlePigsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 1 | 2 | 3 | "result";
type Answer = "YES" | "NO" | null;

const QUESTIONS = [
    {
        step: 1,
        title: "The Human Capital Stress Test",
        question: "If you and your top two managers vanished suddenly for 90 days, could a qualified stranger step in and run the company profitably using only your current written manuals and SOPs?",
        icon: "👥",
    },
    {
        step: 2,
        title: "The Operational Resilience Test",
        question: "If your main business bank account froze, your website crashed, and your HQ lost power simultaneously, do you have a pre-written, tested 'Disaster Playbook' that your team could execute to keep customers from noticing?",
        icon: "⚡",
    },
    {
        step: 3,
        title: "The Exit Readiness Test",
        question: "If a qualified buyer wired a $10M offer today on the condition of a 24-hour audit, is your digital 'Data Room' (clean financials, contracts, IP, Tax returns) ready to be shared right this second?",
        icon: "💰",
    },
];

// Results based on YES count
const RESULTS = {
    straw: {
        title: "Verdict: Your Business is Made of STRAW",
        icon: "🏚️",
        color: "text-signal-red",
        bgColor: "bg-signal-red/10",
        borderColor: "border-signal-red/30",
        reply: "You don't own a business; you own a high-risk job. Your revenue relies almost entirely on your personal presence and daily 'hustle.' One significant 'wolf'—personal illness, key employee departure, or market shift—will blow the entire operation down. You are currently un-investable and highly vulnerable.",
    },
    wood: {
        title: "Verdict: Your Business is Made of WOOD",
        icon: "🏠",
        color: "text-signal-yellow",
        bgColor: "bg-signal-yellow/10",
        borderColor: "border-signal-yellow/30",
        reply: "You have achieved fragile success. You have some structures in place, but they are brittle. You likely rely on the 'heroics' of key team members rather than boring, reliable processes. You might survive a major blow, but the repairs will decimate your profit margins and burn you out. You need to reinforce your foundations immediately.",
    },
    brick: {
        title: "Verdict: Your Business is Made of BRICK",
        icon: "🏰",
        color: "text-signal-green",
        bgColor: "bg-signal-green/10",
        borderColor: "border-signal-green/30",
        reply: "You have built a true institutional-grade asset. Your business exists independently of its founders. It is resilient, transferable, and highly valuable to investors because the safety is baked into the systems, not dependent on fair weather. You are ready for the real world.",
    },
};

export function ThreeLittlePigsModal({ isOpen, onClose }: ThreeLittlePigsModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [answers, setAnswers] = useState<Answer[]>([null, null, null]);

    const handleAnswer = (answer: "YES" | "NO") => {
        if (currentStep === "result") return;
        
        const newAnswers = [...answers];
        newAnswers[currentStep - 1] = answer;
        setAnswers(newAnswers);

        if (currentStep < 3) {
            setCurrentStep((currentStep + 1) as Step);
        } else {
            setCurrentStep("result");
        }
    };

    const calculateResult = () => {
        const yesCount = answers.filter(a => a === "YES").length;
        if (yesCount === 0) return RESULTS.straw;
        if (yesCount <= 2) return RESULTS.wood;
        return RESULTS.brick;
    };

    const handleClose = () => {
        setCurrentStep(1);
        setAnswers([null, null, null]);
        onClose();
    };

    const scrollToServices = () => {
        handleClose();
        // Scroll to services section
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const progressPercent = currentStep === "result" ? 100 : ((currentStep - 1) / 3) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl bg-background border-border p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Real World Readiness Test</DialogTitle>
                    <DialogDescription>3 questions to assess your business resilience</DialogDescription>
                </DialogHeader>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {/* QUESTION STEPS */}
                    {currentStep !== "result" && (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="p-8 md:p-10"
                        >
                            {/* Step Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            step <= currentStep ? "bg-primary" : "bg-muted"
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Question */}
                            <div className="text-center space-y-6">
                                <div className="text-5xl">{QUESTIONS[currentStep - 1].icon}</div>
                                
                                <div>
                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                        Step {currentStep} of 3
                                    </p>
                                    <h3 className="font-heading text-xl text-primary font-bold">
                                        {QUESTIONS[currentStep - 1].title}
                                    </h3>
                                </div>

                                <p className="text-lg text-foreground leading-relaxed max-w-lg mx-auto">
                                    {QUESTIONS[currentStep - 1].question}
                                </p>

                                {/* Answer Buttons */}
                                <div className="flex gap-4 justify-center pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer("YES")}
                                        className="px-8 py-4 bg-signal-green/20 border-2 border-signal-green text-signal-green font-bold uppercase tracking-wider rounded-lg hover:bg-signal-green/30 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        YES
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer("NO")}
                                        className="px-8 py-4 bg-muted border-2 border-border text-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-muted/80 transition-all flex items-center gap-2"
                                    >
                                        <AlertTriangle className="w-5 h-5" />
                                        NO
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* RESULTS SCREEN */}
                    {currentStep === "result" && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 md:p-10"
                        >
                            {(() => {
                                const result = calculateResult();
                                return (
                                    <div className="text-center space-y-6">
                                        {/* Result Icon */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="text-6xl"
                                        >
                                            {result.icon}
                                        </motion.div>

                                        {/* Result Title */}
                                        <h3 className={`font-heading text-2xl md:text-3xl font-bold ${result.color}`}>
                                            {result.title}
                                        </h3>

                                        {/* Result Description */}
                                        <div className={`${result.bgColor} border ${result.borderColor} rounded-xl p-6 text-left`}>
                                            <p className="text-foreground leading-relaxed">
                                                {result.reply}
                                            </p>
                                        </div>

                                        {/* Score Summary */}
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                            <span>
                                                You answered YES to {answers.filter(a => a === "YES").length} of 3 questions
                                            </span>
                                        </div>

                                        {/* CTA Button */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            onClick={scrollToServices}
                                            className="group px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all flex items-center gap-3 mx-auto"
                                        >
                                            See How To Build With Brick
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>

                                        {/* Retake Button */}
                                        <button
                                            onClick={() => {
                                                setCurrentStep(1);
                                                setAnswers([null, null, null]);
                                            }}
                                            className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Retake the Test
                                        </button>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
