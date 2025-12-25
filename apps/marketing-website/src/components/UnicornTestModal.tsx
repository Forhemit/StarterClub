"use client";

import { useState, useMemo, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Trophy, AlertTriangle, Target, Zap, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface UnicornTestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// The 5 Pillars
const PILLARS = [
    { id: "structural", icon: "🧱", name: "Structural Integrity", tagline: "Does it collapse if you take a vacation?" },
    { id: "operational", icon: "🔄", name: "Operational Continuity", tagline: "Can it survive chaos or sudden success?" },
    { id: "financial", icon: "📊", name: "Financial & Records Health", tagline: "Would an auditor smile or cry?" },
    { id: "transferability", icon: "🔁", name: "Transferability & Independence", tagline: "Could someone else run it tomorrow?" },
    { id: "strategic", icon: "🧠", name: "Strategic Resilience", tagline: "Does it have a future when reality hits?" },
] as const;

// The 12 Questions
const QUESTIONS = [
    // Pillar 1: Structural Integrity (3 questions)
    { pillar: "structural", text: "Are your core operations (sales, delivery, support) documented so clearly that a new hire could follow them?", reason: "This relates to having detailed Standard Operating Procedures (SOPs), systems, and processes documented." },
    { pillar: "structural", text: "Is it crystal clear who is responsible for what, and who has the final say on key decisions?", reason: "Clear role definitions and decision-making authority prevent bottlenecks and confusion during critical moments." },
    { pillar: "structural", text: "If your most crucial person vanished for a year or more, would the business stumble or collapse?", reason: "Key person dependency is a major risk factor that affects business valuation and operational stability." },
    // Pillar 2: Operational Continuity (2 questions)
    { pillar: "operational", text: "How prepared are you to handle two major problems at once? (e.g., a frozen bank account and losing your chief financial officer)", reason: "This measures having strong Operational Continuity plans in place and ready to deploy." },
    { pillar: "operational", text: "A celebrity just unexpectedly endorsed your core product. Orders are flooding in at 4x your normal rate and are still climbing! Do you have systems and processes in place to easily handle the sudden spike in sales and inquires?", reason: "Scalability under pressure reveals whether your infrastructure can handle rapid growth opportunities." },
    // Pillar 3: Financial & Records Health (3 questions)
    { pillar: "financial", text: "How accurate, up-to-date, and trustworthy are your profit/loss, cash flow, and balance sheet reports?", reason: "To make clear decisions based on accurate and up-to-date information." },
    { pillar: "financial", text: "How quickly could you find any client contract, major invoice, or tax filing from two years ago?", reason: "Document organization reflects operational maturity, audit and due diligence readiness." },
    { pillar: "financial", text: "If a serious investor asked to see everything tomorrow, how much scrambling would be required?", reason: "Investor and bank readiness indicates how well your business is structured for growth." },
    // Pillar 4: Transferability & Independence (2 questions)
    { pillar: "transferability", text: "How much does the business rely on you personally to function day-to-day? (Are you the chief 'answer-getter'?)", reason: "Owner dependency directly impacts business valuation and limits exit options." },
    { pillar: "transferability", text: "How easy would it be for a new owner or operator to run the business with no help from you?", reason: "Transferability determines whether your business is a sellable asset or just a job you own." },
    // Pillar 5: Strategic Resilience (2 questions)
    { pillar: "strategic", text: "How well could your business weather a sustained 12-month economic downturn or a 50% drop in revenue for 12 months?", reason: "Financial runway and contingency planning determine survival during extended market stress." },
    { pillar: "strategic", text: "When market conditions for your product or service shift, do you have a clear, actionable plan to pivot, or will you or your team have to think of something when it happens?", reason: "Strategic adaptability separates thriving businesses from those caught off-guard by market changes." },
];

const RATING_LABELS = [
    { value: 1, label: "Chaos Gremlin", color: "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" },
    { value: 2, label: "Struggling", color: "bg-orange-500/20 border-orange-500/50 text-orange-400 hover:bg-orange-500/30" },
    { value: 3, label: "Duct-Taped", color: "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30" },
    { value: 4, label: "Solid", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30" },
    { value: 5, label: "Boring & Brilliant", color: "bg-signal-green/20 border-signal-green/50 text-signal-green hover:bg-signal-green/30" },
];

type Stage = "intro" | "questions" | "calculating" | "results";

function calculateGrade(score: number): { grade: string; label: string; color: string } {
    if (score >= 4.5) return { grade: "A", label: "Resilient. Built to last and scale.", color: "text-signal-green" };
    if (score >= 3.8) return { grade: "B", label: "Solid. Strong foundation, with key areas to fortify.", color: "text-emerald-400" };
    if (score >= 3.0) return { grade: "C", label: "Vulnerable. Operational but fragile. Work needed.", color: "text-amber-400" };
    if (score >= 2.0) return { grade: "D", label: "At Risk. Heavily dependent on constant effort.", color: "text-orange-400" };
    return { grade: "F", label: "Critical. Survival is a daily achievement.", color: "text-red-400" };
}

function getPillarGrade(score: number): { grade: string; message: string; color: string } {
    if (score >= 4.5) return { grade: "A", message: "Excellent!", color: "text-signal-green" };
    if (score >= 3.8) return { grade: "B", message: "Can handle a bump", color: "text-emerald-400" };
    if (score >= 3.0) return { grade: "C", message: "Needs attention", color: "text-amber-400" };
    if (score >= 2.0) return { grade: "D", message: "Major weakness", color: "text-orange-400" };
    return { grade: "F", message: "Critical gap", color: "text-red-400" };
}

export function UnicornTestModal({ isOpen, onClose }: UnicornTestModalProps) {
    const [stage, setStage] = useState<Stage>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(12).fill(0));
    const [isPending, startTransition] = useTransition();

    // Calculate which pillar we're on
    const currentPillar = useMemo(() => {
        if (currentQuestion < 3) return 0;
        if (currentQuestion < 5) return 1;
        if (currentQuestion < 8) return 2;
        if (currentQuestion < 10) return 3;
        return 4;
    }, [currentQuestion]);

    // Calculate pillar completion status
    const pillarProgress = useMemo(() => {
        return PILLARS.map((_, index) => {
            if (index < currentPillar) return "complete";
            if (index === currentPillar) return "active";
            return "pending";
        });
    }, [currentPillar]);

    // Calculate scores
    const scores = useMemo(() => {
        const structural = (answers[0] + answers[1] + answers[2]) / 3;
        const operational = (answers[3] + answers[4]) / 2;
        const financial = (answers[5] + answers[6] + answers[7]) / 3;
        const transferability = (answers[8] + answers[9]) / 2;
        const strategic = (answers[10] + answers[11]) / 2;
        const overall = answers.reduce((a, b) => a + b, 0) / 12;

        return { structural, operational, financial, transferability, strategic, overall };
    }, [answers]);

    // Badges logic
    const badges = useMemo(() => {
        const earned = [];
        if (scores.financial >= 4.0) earned.push({ name: "The Archivist", desc: "For your Financial Health score!" });
        if (scores.transferability < 3.0 && scores.overall > 0) earned.push({ name: "Founder Bottleneck Identified", desc: "The first step to fixing it" });
        if (scores.operational >= 4.0) earned.push({ name: "Crisis Ready", desc: "Your operations can handle chaos" });
        if (scores.strategic >= 4.0) earned.push({ name: "Strategic Thinker", desc: "You plan for the future" });
        if (scores.structural >= 4.5) earned.push({ name: "Rock Solid", desc: "Your foundation is unshakeable" });
        return earned;
    }, [scores]);

    const handleAnswer = (rating: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = rating;
        setAnswers(newAnswers);

        if (currentQuestion < 11) {
            setTimeout(() => {
                startTransition(() => {
                    setCurrentQuestion(currentQuestion + 1);
                });
            }, 300);
        } else {
            setStage("calculating");
            setTimeout(() => setStage("results"), 2000);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            startTransition(() => {
                setCurrentQuestion(currentQuestion - 1);
            });
        }
    };

    const handleClose = () => {
        // Reset state
        setStage("intro");
        setCurrentQuestion(0);
        setAnswers(Array(12).fill(0));
        onClose();
    };

    const startTest = () => {
        setStage("questions");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-primary/20 p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Free Unicorn Ready Test</DialogTitle>
                    <DialogDescription>Discover if your business is built to survive, thrive, and sell.</DialogDescription>
                </DialogHeader>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <AnimatePresence mode="wait">
                    {/* INTRO STAGE */}
                    {stage === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-8 md:p-12 text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                    className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                                >
                                    <Target className="w-10 h-10 text-primary" />
                                </motion.div>
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    The Business Resilience Audit
                                </h2>
                                <p className="text-primary font-medium italic">
                                    Unlock Your True Potential
                                </p>
                            </div>

                            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                                Stop guessing. Start knowing. In <span className="text-foreground font-semibold">12 questions</span>, discover if your business is built to survive, thrive, and sell.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 py-4">
                                {PILLARS.map((pillar, i) => (
                                    <motion.div
                                        key={pillar.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground flex items-center gap-2"
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
                                onClick={startTest}
                                className="group px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                            >
                                Start Your Audit
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* QUESTIONS STAGE */}
                    {stage === "questions" && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 md:p-8 space-y-6"
                        >
                            {/* Progress Bar */}
                            <div className="flex items-center justify-between gap-2">
                                {PILLARS.map((pillar, i) => (
                                    <div key={pillar.id} className="flex-1 flex flex-col items-center gap-1">
                                        <motion.div
                                            animate={{
                                                scale: pillarProgress[i] === "active" ? 1.1 : 1,
                                                opacity: pillarProgress[i] === "pending" ? 0.4 : 1,
                                            }}
                                            className={`text-2xl transition-all ${pillarProgress[i] === "complete" ? "drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]" : ""
                                                }`}
                                        >
                                            {pillar.icon}
                                        </motion.div>
                                        <div className={`h-1 w-full rounded-full transition-all ${pillarProgress[i] === "complete" ? "bg-signal-green" :
                                            pillarProgress[i] === "active" ? "bg-primary/50" : "bg-muted"
                                            }`} />
                                    </div>
                                ))}
                            </div>

                            {/* Question Counter */}
                            <div className="text-center">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                    Question {currentQuestion + 1} of 12
                                </span>
                                <div className="text-sm text-primary font-medium mt-1">
                                    {PILLARS[currentPillar].name}
                                </div>
                            </div>

                            {/* Question Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestion}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-6 space-y-6"
                                >
                                    <p className="text-lg md:text-xl text-foreground leading-relaxed">
                                        {QUESTIONS[currentQuestion].text}
                                    </p>

                                    {/* Rating Buttons */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {RATING_LABELS.map((rating) => (
                                            <motion.button
                                                key={rating.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAnswer(rating.value)}
                                                className={`p-3 md:p-4 rounded-lg border transition-all flex flex-col items-center gap-1 ${rating.color} ${answers[currentQuestion] === rating.value ? "ring-2 ring-primary" : ""
                                                    }`}
                                            >
                                                <span className="text-2xl font-bold">{rating.value}</span>
                                                <span className="text-[10px] md:text-xs text-center leading-tight hidden sm:block">
                                                    {rating.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Why We Ask This */}
                                    <div className="mt-4 pt-4 border-t border-border/30">
                                        <p className="text-sm text-foreground/90">
                                            <span className="font-semibold text-primary">Why we ask: </span>
                                            {QUESTIONS[currentQuestion].reason}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            {currentQuestion > 0 && (
                                <button
                                    onClick={handleBack}
                                    disabled={isPending}
                                    className={`flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous Question
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* CALCULATING STAGE */}
                    {stage === "calculating" && (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-12 text-center space-y-6 min-h-[400px] flex flex-col items-center justify-center"
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

                    {/* RESULTS STAGE */}
                    {stage === "results" && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Trophy className="w-12 h-12 text-primary mx-auto" />
                                </motion.div>
                                <div>
                                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                                        Your Resilience Report Card
                                    </p>
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <span className={`text-6xl font-heading font-bold ${calculateGrade(scores.overall).color}`}>
                                            {calculateGrade(scores.overall).grade}
                                        </span>
                                        {scores.overall > 0 && (
                                            <span className="text-muted-foreground text-lg">
                                                ({scores.overall.toFixed(1)}/5.0)
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mt-2 italic">
                                        "{calculateGrade(scores.overall).label}"
                                    </p>
                                </div>
                            </div>

                            {/* Pillar Breakdown */}
                            <div className="space-y-3">
                                <h4 className="font-heading text-lg text-foreground">Pillar Breakdown</h4>
                                <div className="space-y-2">
                                    {[
                                        { pillar: PILLARS[0], score: scores.structural },
                                        { pillar: PILLARS[1], score: scores.operational },
                                        { pillar: PILLARS[2], score: scores.financial },
                                        { pillar: PILLARS[3], score: scores.transferability },
                                        { pillar: PILLARS[4], score: scores.strategic },
                                    ].map(({ pillar, score }) => {
                                        const grade = getPillarGrade(score);
                                        return (
                                            <motion.div
                                                key={pillar.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{pillar.icon}</span>
                                                    <span className="text-foreground text-sm">{pillar.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${grade.color}`}>{grade.grade}</span>
                                                    <span className="text-xs text-muted-foreground hidden sm:inline">
                                                        ({grade.message})
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Badges */}
                            {badges.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-heading text-lg text-foreground flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-primary" />
                                        Earned Badges
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {badges.map((badge, i) => (
                                            <motion.div
                                                key={badge.name}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg"
                                            >
                                                <div className="text-sm font-medium text-primary">{badge.name}</div>
                                                <div className="text-xs text-muted-foreground">{badge.desc}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Progress Indicator */}
                            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progress to Sellable Business</span>
                                    <span className="text-foreground font-bold">
                                        {Math.round((scores.overall / 5) * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(scores.overall / 5) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary to-signal-green rounded-full"
                                    />
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
                                <Sparkles className="w-8 h-8 text-primary mx-auto" />
                                <div>
                                    <h4 className="font-heading text-xl text-foreground">
                                        Your diagnosis is complete. Now, get the prescription.
                                    </h4>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        Get your personalized Stability Blueprint—a clear, prioritized 30-day action plan.
                                    </p>
                                </div>
                                <button className="px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto">
                                    Get My Blueprint
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Retake Button */}
                            <button
                                onClick={() => {
                                    setStage("intro");
                                    setCurrentQuestion(0);
                                    setAnswers(Array(12).fill(0));
                                }}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                            >
                                Retake the Test
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
