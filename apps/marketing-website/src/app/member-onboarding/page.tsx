"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sprout,
    Building2,
    Globe,
    Store,
    Layers,
    Target,
    TrendingUp,
    Lightbulb,
    ShieldCheck,
    ArrowRight,
    Loader2,
    Briefcase,
    Zap,
    Flag,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateMemberContext, type MemberContext } from "./_actions";


type Step = "stage" | "model" | "info" | "goal";

export default function MemberOnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signOut } = useClerk();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>("stage");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isRacetrack = mounted && theme === 'racetrack';

    const [data, setData] = useState<Partial<MemberContext>>({});

    // Auto-save handler for returning users
    useEffect(() => {
        const saveParam = searchParams.get('save');
        if (saveParam === 'true' && user && !isAutoSaving && !isSubmitting) {
            const stage = searchParams.get('stage') as MemberContext['stage'];
            const model = searchParams.get('model') as MemberContext['model'];
            const goal = searchParams.get('goal');

            if (stage && model && goal) {
                console.log("Auto-saving context from URL params...");
                setIsAutoSaving(true);
                // Execute save immediately
                handleAutoSave(stage, model, goal);
            }
        }
    }, [user, searchParams, isAutoSaving, isSubmitting]);

    const handleAutoSave = async (stage: MemberContext['stage'], model: MemberContext['model'], goal: string) => {
        try {
            const res = await updateMemberContext({
                stage,
                model,
                primaryGoal: goal
            });

            if (res.success) {
                window.location.href = "/dashboard";
            } else {
                console.error("Failed to auto-save context:", res.error);
                setIsAutoSaving(false);
            }
        } catch (e) {
            console.error("Exception in auto-save:", e);
            setIsAutoSaving(false);
        }
    };

    const handleStageSelect = (stage: MemberContext['stage']) => {
        setData(prev => ({ ...prev, stage }));
        setStep("model");
    };

    const handleModelSelect = (model: MemberContext['model']) => {
        setData(prev => ({ ...prev, model }));
        setStep("info");
    };

    const handleInfoCapture = (info: NonNullable<MemberContext['organizationInfo']>) => {
        setData(prev => ({ ...prev, organizationInfo: info }));
        setStep("goal");
    };

    const handleGoalSelect = async (goal: string) => {
        // Optimistic UI update
        const finalData = { ...data, primaryGoal: goal } as MemberContext;
        setData(finalData);
        setIsSubmitting(true);

        if (!user) {
            console.log("User not logged in, redirecting to sign-up to save context...");
            const currentPath = window.location.pathname;
            const params = new URLSearchParams();
            params.set('stage', finalData.stage);
            params.set('model', finalData.model);
            params.set('goal', finalData.primaryGoal);
            if (finalData.organizationInfo) {
                params.set('orgName', finalData.organizationInfo.name);
                params.set('orgFirst', finalData.organizationInfo.firstName);
                params.set('orgLast', finalData.organizationInfo.lastName);
                params.set('orgPhone', finalData.organizationInfo.phone);
            }
            params.set('save', 'true');

            const returnUrl = `${currentPath}?${params.toString()}`;
            // Append track param so sign-up page knows to show Membership Selection
            const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(returnUrl)}&track=build_something`;
            window.location.href = signUpUrl;
            return;
        }

        try {
            const res = await updateMemberContext({
                stage: finalData.stage,
                model: finalData.model,
                primaryGoal: finalData.primaryGoal,
                organizationInfo: finalData.organizationInfo
            });

            if (res.success) {
                // Refresh to update middleware/layout state
                window.location.href = "/dashboard";
            } else {
                console.error("Failed to save context");
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setIsSubmitting(false);
        }
    };

    if (isAutoSaving) {
        return (
            <div className={cn("min-h-screen flex flex-col items-center justify-center p-4", isRacetrack ? "bg-background text-signal-green font-mono" : "bg-background")}>
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className={cn("w-12 h-12 animate-spin", isRacetrack ? "text-signal-green" : "text-primary")} />
                    <h2 className={cn("text-xl font-semibold", isRacetrack && "uppercase tracking-widest")}>
                        {isRacetrack ? "ESTABLISHING UPLINK..." : "Setting up your profile..."}
                    </h2>
                </div>
            </div>
        );
    }

    const currentStepIndex = step === "stage" ? 1 : step === "model" ? 2 : step === "info" ? 3 : 4;
    const totalSteps = 4;

    return (
        <div className={cn(
            "min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500",
            isRacetrack ? "bg-black text-foreground font-mono selection:bg-signal-green selection:text-black" : "bg-background"
        )}>
            {/* Racetrack Background Overlay */}
            {isRacetrack && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                </div>
            )}

            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <button
                    onClick={() => {
                        if (user) {
                            signOut({ redirectUrl: '/' });
                        } else {
                            router.push('/');
                        }
                    }}
                    className={cn(
                        "text-sm transition-colors flex items-center gap-2",
                        isRacetrack
                            ? "text-signal-green/60 hover:text-signal-green uppercase tracking-widest border border-transparent hover:border-signal-green/30 px-3 py-1 bg-black/50"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    {isRacetrack ? "ABORT TO HOME" : "Back to Home"}
                </button>
            </div>

            <div className="max-w-4xl w-full space-y-8 relative z-10">
                {/* Progress Indicator */}
                <div className="w-full max-w-xs mx-auto space-y-2">
                    <div className={cn(
                        "flex justify-between text-xs font-semibold uppercase tracking-wider",
                        isRacetrack ? "text-signal-green/80" : "text-muted-foreground"
                    )}>
                        <span>Step {currentStepIndex} of {totalSteps}</span>
                        {isRacetrack ? (
                            <span>SYS.READY: {Math.round(currentStepIndex / totalSteps * 100)}%</span>
                        ) : (
                            <span>{Math.round(currentStepIndex / totalSteps * 100)}% Complete</span>
                        )}
                    </div>

                    {isRacetrack ? (
                        /* Sector/Lap Style Progress Bar */
                        <div className="flex gap-1 h-2 w-full">
                            {[1, 2, 3, 4].map((s) => (
                                <motion.div
                                    key={s}
                                    className={cn(
                                        "flex-1 rounded-none",
                                        s <= currentStepIndex
                                            ? "bg-signal-green shadow-[0_0_8px_rgba(0,255,157,0.5)]"
                                            : "bg-signal-green/10"
                                    )}
                                    initial={false}
                                    animate={{
                                        opacity: s <= currentStepIndex ? 1 : 0.3,
                                        backgroundColor: s <= currentStepIndex ? "rgb(0, 255, 157)" : "rgba(0, 255, 157, 0.1)"
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Standard Progress Bar */
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "25%" }}
                                animate={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {step === "stage" && (
                        <StepStage key="stage" onSelect={handleStageSelect} isRacetrack={isRacetrack} />
                    )}
                    {step === "model" && (
                        <StepModel key="model" onSelect={handleModelSelect} isRacetrack={isRacetrack} />
                    )}
                    {step === "info" && (
                        <StepInfoCapture key="info" initialData={data.organizationInfo} onSubmit={handleInfoCapture} isRacetrack={isRacetrack} />
                    )}
                    {step === "goal" && data.stage && (
                        <StepGoal
                            key="goal"
                            stage={data.stage}
                            onSelect={handleGoalSelect}
                            isSubmitting={isSubmitting}
                            isRacetrack={isRacetrack}
                        />
                    )}
                </AnimatePresence>

                {/* Micro Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className={cn(
                        "flex justify-center items-center space-x-2 text-sm pt-8",
                        isRacetrack ? "text-signal-green/60 font-mono" : "text-muted-foreground"
                    )}
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn(
                                "w-6 h-6 rounded-full border-2 overflow-hidden bg-gray-200",
                                isRacetrack ? "border-black grayscale opacity-80" : "border-background"
                            )}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=p${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <span>
                        {isRacetrack ? "FLEET EXPANSION :: +500 UNITS THIS CYCLE" : "Joined by 500+ founders this week"}
                    </span>
                </motion.div>

            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Step 1: Business Stage
// ----------------------------------------------------------------------

function StepStage({ onSelect, isRacetrack }: { onSelect: (val: 'new' | 'existing') => void, isRacetrack: boolean }) {
    const options = [
        {
            id: 'new',
            title: isRacetrack ? 'PROTOTYPE CLASS' : 'New Business',
            subtitle: isRacetrack ? 'Concept validation. First aerodynamic tests.' : 'Idea stage, pre-revenue, or early validation.',
            icon: isRacetrack ? Sprout : Sprout, // Could swap icons if available
            color: 'text-green-500',
            racetrackColor: "text-signal-green"
        },
        {
            id: 'existing',
            title: isRacetrack ? 'GT CLASS' : 'Existing Business',
            subtitle: isRacetrack ? 'Race proven. Optimizing for track domination.' : 'Revenue, customers, and operations running.',
            icon: isRacetrack ? Flag : Building2,
            color: 'text-blue-500',
            racetrackColor: "text-signal-yellow"
        }
    ] as const;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "SELECT VEHICLE CLASS" : "Where are you in your business journey?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Configuration parameters depend on current velocity." : "We'll tailor your dashboard to your current reality."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {options.map((opt) => (
                    <Card
                        key={opt.id}
                        className={cn(
                            "cursor-pointer transition-all group overflow-hidden relative border",
                            isRacetrack
                                ? "bg-black/80 hover:bg-white/5 border-white/20 hover:border-signal-green rounded-none"
                                : "hover:border-primary/50 hover:shadow-lg"
                        )}
                        onClick={() => onSelect(opt.id)}
                    >
                        {/* Tech Corners for Racetrack */}
                        {isRacetrack && (
                            <>
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
                            </>
                        )}

                        <div className={cn(
                            "absolute top-0 left-0 w-1 h-full transition-colors",
                            isRacetrack ? "bg-transparent group-hover:bg-signal-green" : "bg-transparent group-hover:bg-primary"
                        )} />

                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                            <div className={cn(
                                "p-4 transition-colors",
                                isRacetrack
                                    ? "bg-white/5 group-hover:bg-signal-green/20 rounded-none border border-white/10"
                                    : "rounded-full bg-secondary group-hover:bg-background",
                                isRacetrack ? opt.racetrackColor : opt.color
                            )}>
                                <opt.icon className={cn("w-10 h-10")} />
                            </div>
                            <div>
                                <h3 className={cn("text-2xl font-bold", isRacetrack && "font-mono uppercase tracking-wide")}>{opt.title}</h3>
                                <p className="text-muted-foreground mt-2">{opt.subtitle}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 2: Business Model
// ----------------------------------------------------------------------

function StepModel({ onSelect, isRacetrack }: { onSelect: (val: 'online' | 'physical' | 'hybrid') => void, isRacetrack: boolean }) {
    const options = [
        {
            id: 'online',
            title: isRacetrack ? 'DIGITAL SIMULATION' : 'Online Only',
            subtitle: 'Digital products, services, or e-commerce.',
            icon: Globe,
        },
        {
            id: 'physical',
            title: 'HARDWARE TRACK',
            subtitle: 'Brick & mortar, retail, or local service.',
            icon: Store,
        },
        {
            id: 'hybrid',
            title: 'HYBRID ENGINE',
            subtitle: 'Both online presence and physical footprint.',
            icon: Layers,
        }
    ] as const;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "OPERATIONAL TERRAIN" : "How does your business show up in the world?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Scouting the optimal racing line." : "This helps us surface relevant tools and partners."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => (
                    <Card
                        key={opt.id}
                        className={cn(
                            "cursor-pointer transition-all group border",
                            isRacetrack
                                ? "bg-black/80 hover:bg-white/5 border-white/20 hover:border-signal-yellow rounded-none relative"
                                : "hover:border-primary/50 hover:shadow-lg"
                        )}
                        onClick={() => onSelect(opt.id)}
                    >
                        {/* Tech Corners for Racetrack */}
                        {isRacetrack && (
                            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="animate-pulse w-1.5 h-1.5 bg-signal-yellow rounded-full" />
                            </div>
                        )}

                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                            <div className={cn(
                                "p-4 transition-colors",
                                isRacetrack
                                    ? "bg-white/5 group-hover:bg-signal-yellow/20 rounded-none w-full flex justify-center border-b border-white/10"
                                    : "rounded-full bg-secondary group-hover:bg-primary/10"
                            )}>
                                <opt.icon className={cn("w-8 h-8", isRacetrack ? "text-signal-yellow" : "text-primary")} />
                            </div>
                            <div>
                                <h3 className={cn("text-xl font-bold", isRacetrack && "font-mono uppercase")}>{opt.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{opt.subtitle}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 3: Info Capture
// ----------------------------------------------------------------------

function StepInfoCapture({ initialData, onSubmit, isRacetrack }: { initialData: MemberContext['organizationInfo'] | undefined, onSubmit: (val: any) => void, isRacetrack: boolean }) {
    const [info, setInfo] = useState(initialData || { name: "", firstName: "", lastName: "", phone: "", contactEmail: "" });
    const { user } = useUser();

    // Prefill name/email if available
    useEffect(() => {
        if (user) {
            setInfo(prev => ({
                ...prev,
                contactEmail: prev.contactEmail || user.primaryEmailAddress?.emailAddress || "",
                firstName: prev.firstName || user.firstName || "",
                lastName: prev.lastName || user.lastName || ""
            }));
        }
    }, [user]);

    const handleChange = (field: string, val: string) => {
        setInfo(prev => ({ ...prev, [field]: val }));
    };

    const isValid = info.name && info.firstName && info.lastName && info.phone && info.contactEmail;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 max-w-xl mx-auto"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "ENTITY REGISTRATION" : "Tell us about your organization"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Logs required for fleet alignment." : "This helps us evaluate alignment and recommend opportunities."}
                </p>
            </div>

            <Card className={cn(
                "border",
                isRacetrack ? "bg-black/80 border-white/20 rounded-none" : "bg-card"
            )}>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="company" className={isRacetrack ? "font-mono uppercase text-xs" : ""}>Company Name</Label>
                            <Input
                                id="company"
                                value={info.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={isRacetrack ? "bg-white/5 border-white/10 rounded-none focus:border-signal-green" : ""}
                                placeholder="Acme Corp"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className={isRacetrack ? "font-mono uppercase text-xs" : ""}>First Name</Label>
                                <Input
                                    id="firstName"
                                    value={info.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className={isRacetrack ? "bg-white/5 border-white/10 rounded-none focus:border-signal-green" : ""}
                                    placeholder="Jane"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className={isRacetrack ? "font-mono uppercase text-xs" : ""}>Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={info.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className={isRacetrack ? "bg-white/5 border-white/10 rounded-none focus:border-signal-green" : ""}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className={isRacetrack ? "font-mono uppercase text-xs" : ""}>Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={info.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className={isRacetrack ? "bg-white/5 border-white/10 rounded-none focus:border-signal-green" : ""}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className={isRacetrack ? "font-mono uppercase text-xs" : ""}>Primary Contact Email</Label>
                                <Input
                                    id="email"
                                    value={info.contactEmail}
                                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                                    className={isRacetrack ? "bg-white/5 border-white/10 rounded-none focus:border-signal-green" : ""}
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    className={cn(
                        "min-w-[200px] h-14 text-lg",
                        isRacetrack
                            ? "bg-signal-green text-black hover:bg-signal-green/90 font-mono tracking-wider rounded-none"
                            : "rounded-full"
                    )}
                    disabled={!isValid}
                    onClick={() => onSubmit(info)}
                >
                    {isRacetrack ? "SUBMIT MANIFEST" : "Next"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 4: Primary Goal
// ----------------------------------------------------------------------

function StepGoal({ stage, onSelect, isSubmitting, isRacetrack }: { stage: 'new' | 'existing', onSelect: (val: string) => void, isSubmitting: boolean, isRacetrack: boolean }) {

    const newBusOptions = [
        {
            id: 'durable_business',
            title: isRacetrack ? 'ENDURANCE RACING (Long Term)' : 'Build a strong business that lasts',
            icon: ShieldCheck,
        },
        {
            id: 'increase_success',
            title: isRacetrack ? 'REDUCE CRASH PROBABILITY' : 'Increase my chances of success',
            icon: TrendingUp,
        },
        {
            id: 'idea_to_real',
            title: isRacetrack ? 'PROTOTYPE TO PRODUCTION' : 'Turn an idea into a real business',
            icon: Lightbulb,
        }
    ];

    const existingBusOptions = [
        {
            id: 'stronger',
            title: isRacetrack ? 'TURBOCHARGE ENGINE' : 'Build a stronger business',
            icon: TrendingUp,
        },
        {
            id: 'not_a_job',
            title: isRacetrack ? 'AUTOMATE CREW OPERATIONS' : 'Create a business, not a job',
            icon: Briefcase,
        },
        {
            id: 'transfer_legacy',
            title: isRacetrack ? 'CHAMPIONSHIP LEGACY' : 'Prepare for transfer, exit, or legacy',
            icon: Target,
        }
    ];

    const options = stage === 'new' ? newBusOptions : existingBusOptions;

    const title = stage === 'new'
        ? (isRacetrack ? "PRIMARY MISSION OBJECTIVE" : "What’s the outcome you care about most right now?")
        : (isRacetrack ? "CURRENT BUILD TARGET" : "What are you trying to build now?");

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {title}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Telemetry will be calibrated for this target." : "We'll align your dashboard goals to this outcome."}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                {options.map((opt) => (
                    <Card
                        key={opt.id}
                        className={cn(
                            "cursor-pointer transition-all group border",
                            isRacetrack
                                ? "bg-black/80 hover:bg-signal-green/10 border-white/20 hover:border-signal-green rounded-none"
                                : "hover:border-primary hover:bg-primary/5",
                            isSubmitting && "opacity-50 pointer-events-none"
                        )}
                        onClick={() => onSelect(opt.id)}
                    >
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "p-2",
                                    isRacetrack
                                        ? "bg-transparent border border-signal-green/30"
                                        : "rounded-full bg-background border shadow-sm"
                                )}>
                                    <opt.icon className={cn("w-6 h-6", isRacetrack ? "text-signal-green" : "text-primary")} />
                                </div>
                                <span className={cn("text-lg font-medium", isRacetrack && "font-mono uppercase")}>{opt.title}</span>
                            </div>
                            <ArrowRight className={cn("w-5 h-5 transition-colors", isRacetrack ? "text-signal-green" : "text-muted-foreground group-hover:text-primary")} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isSubmitting && (
                <div className="flex justify-center mt-8">
                    <Loader2 className={cn("w-8 h-8 animate-spin", isRacetrack ? "text-signal-green" : "text-primary")} />
                </div>
            )}
        </motion.div>
    );
}
