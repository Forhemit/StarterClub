"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Briefcase,
    Globe,
    Zap,
    Users,
    ArrowRight,
    Loader2,
    Handshake,
    Mic,
    PenTool,
    GraduationCap,
    Lightbulb,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePartnerContext, type PartnerContext } from "./_actions";

type Step = "expertise" | "capacity" | "info" | "goal" | "summary";

export default function PartnerOnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { signOut } = useClerk();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>("expertise");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isRacetrack = mounted && theme === 'racetrack';

    const [data, setData] = useState<Partial<PartnerContext>>({
        expertise: [],
        capacity: []
    });

    const handleExpertiseSelect = (expertise: string) => {
        setData(prev => ({ ...prev, expertise: [expertise] }));
        setStep("capacity");
    };

    const handleCapacitySelect = (capacity: string[]) => {
        setData(prev => ({ ...prev, capacity }));
        setStep("info");
    };

    const handleInfoCapture = (info: NonNullable<PartnerContext['organizationInfo']>) => {
        setData(prev => ({ ...prev, organizationInfo: info }));
        setStep("goal");
    };

    const handleGoalSelect = (goal: string) => {
        const finalData = { ...data, primaryGoal: goal } as PartnerContext;
        setData(finalData);
        setStep("summary");
    };

    const handleSummaryConfirm = async () => {
        if (!user) {
            const currentPath = window.location.pathname;
            const searchParams = new URLSearchParams(window.location.search);
            const returnUrl = currentPath + (searchParams.toString() ? `?${searchParams.toString()}` : "");
            const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(returnUrl)}`;
            window.location.href = signUpUrl;
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await updatePartnerContext({
                expertise: data.expertise!,
                capacity: data.capacity!,
                organizationInfo: data.organizationInfo,
                primaryGoal: data.primaryGoal!
            });

            if (res.success) {
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

    const currentStepIndex = step === "expertise" ? 1 : step === "capacity" ? 2 : step === "info" ? 3 : step === "goal" ? 4 : 5;
    const totalSteps = 5;

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
                        <div className="flex gap-1 h-2 w-full">
                            {[1, 2, 3, 4, 5].map((s) => (
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
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "20%" }}
                                animate={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {step === "expertise" && (
                        <StepExpertise key="expertise" onSelect={handleExpertiseSelect} isRacetrack={isRacetrack} />
                    )}
                    {step === "capacity" && (
                        <StepCapacity key="capacity" onSelect={handleCapacitySelect} isRacetrack={isRacetrack} />
                    )}
                    {step === "info" && (
                        <StepInfoCapture key="info" initialData={data.organizationInfo} onSubmit={handleInfoCapture} isRacetrack={isRacetrack} />
                    )}
                    {step === "goal" && (
                        <StepGoal
                            key="goal"
                            onSelect={handleGoalSelect}
                            isSubmitting={false}
                            isRacetrack={isRacetrack}
                        />
                    )}
                    {step === "summary" && (
                        <StepSummary
                            key="summary"
                            data={data}
                            onConfirm={handleSummaryConfirm}
                            isSubmitting={isSubmitting}
                            isRacetrack={isRacetrack}
                        />
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Option Definitions (Shared)
// ----------------------------------------------------------------------

function getExpertiseOptions(isRacetrack: boolean) {
    return [
        {
            id: 'tech',
            title: isRacetrack ? 'ENGINEERING' : 'Technology & Product',
            subtitle: 'Software, Hardware, Design, or AI.',
            icon: Zap,
        },
        {
            id: 'growth',
            title: isRacetrack ? 'VELOCITY' : 'Marketing & Growth',
            subtitle: 'Sales, Marketing, Content, or GTM.',
            icon: Globe,
        },
        {
            id: 'ops',
            title: isRacetrack ? 'PIT CREW' : 'Operations & Finance',
            subtitle: 'Legal, Finance, HR, or Logistics.',
            icon: Briefcase,
        }
    ] as const;
}

function getCapacityOptions(isRacetrack: boolean) {
    return [
        {
            id: 'mentor',
            title: isRacetrack ? 'CREW CHIEF' : 'Mentorship',
            subtitle: 'Advising founders directly.',
            icon: Users,
        },
        {
            id: 'content',
            title: isRacetrack ? 'DATA ANALYST' : 'Content & Knowledge',
            subtitle: 'Writing playbooks, hosting workshops.',
            icon: PenTool,
        },
        {
            id: 'service',
            title: isRacetrack ? 'SUPPLY CHAIN' : 'Service Provider',
            subtitle: 'Offering tools or agency services.',
            icon: Handshake,
        }
    ] as const;
}

function getGoalOptions(isRacetrack: boolean) {
    return [
        {
            id: 'network',
            title: isRacetrack ? 'EXPAND COMMS NETWORK' : 'Expand my network',
            icon: Users,
        },
        {
            id: 'give_back',
            title: isRacetrack ? 'REINFORCE FLEET' : 'Give back to builders',
            icon: GraduationCap,
        },
        {
            id: 'deal_flow',
            title: isRacetrack ? 'ACQUIRE ASSETS' : 'Find deal flow / clients',
            icon: Target,
        }
    ] as const;
}

// ----------------------------------------------------------------------
// Step 5: Summary
// ----------------------------------------------------------------------

function StepSummary({ data, onConfirm, isSubmitting, isRacetrack }: { data: Partial<PartnerContext>, onConfirm: () => void, isSubmitting: boolean, isRacetrack: boolean }) {
    const expertiseOpts = getExpertiseOptions(isRacetrack);
    const capacityOpts = getCapacityOptions(isRacetrack);
    const goalOpts = getGoalOptions(isRacetrack);

    const getExpertiseLabel = (id: string) => expertiseOpts.find(o => o.id === id)?.title || id;
    const getCapacityLabel = (id: string) => capacityOpts.find(o => o.id === id)?.title || id;
    const getGoalLabel = (id: string) => goalOpts.find(o => o.id === id)?.title || id;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "CONFIRM MANIFEST" : "Review your profile"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Verify parameters before initialization." : "Everything look good? You can always update this later."}
                </p>
            </div>

            <Card className={cn(
                "max-w-xl mx-auto overflow-hidden",
                isRacetrack ? "bg-black/80 border-white/20 rounded-none" : "bg-card"
            )}>
                <div className={cn("h-2 w-full", isRacetrack ? "bg-signal-green" : "bg-primary")} />
                <CardContent className="p-8 space-y-6">
                    {/* Expertise */}
                    <div className="space-y-2">
                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider", isRacetrack ? "text-signal-green/70" : "text-muted-foreground")}>
                            {isRacetrack ? "SPECIALIZATION" : "Expertise"}
                        </h4>
                        <div className="text-lg font-medium">
                            {data.expertise?.map(e => (
                                <span key={e} className="block">{getExpertiseLabel(e)}</span>
                            )) || "None selected"}
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider", isRacetrack ? "text-signal-yellow/70" : "text-muted-foreground")}>
                            {isRacetrack ? "PROTOCOL" : "Contributions"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.capacity?.map(c => (
                                <span key={c} className={cn(
                                    "px-3 py-1 text-sm font-medium",
                                    isRacetrack
                                        ? "bg-signal-yellow/10 text-signal-yellow border border-signal-yellow/20"
                                        : "bg-secondary text-secondary-foreground rounded-full"
                                )}>
                                    {getCapacityLabel(c)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-2">
                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider", isRacetrack ? "text-signal-green/70" : "text-muted-foreground")}>
                            {isRacetrack ? "OBJECTIVE" : "Primary Goal"}
                        </h4>
                        <div className="text-lg font-medium">
                            {data.primaryGoal ? getGoalLabel(data.primaryGoal) : "None selected"}
                        </div>
                    </div>
                </CardContent>
            </Card>


            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    className={cn(
                        "min-w-[200px] h-14 text-lg",
                        isRacetrack
                            ? "bg-signal-green text-black hover:bg-signal-green/90 font-mono tracking-wider rounded-none"
                            : "rounded-full"
                    )}
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    {isRacetrack ? "INITIALIZE SYSTEM" : "Create Account"}
                </Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 1: Expertise
// ----------------------------------------------------------------------

function StepExpertise({ onSelect, isRacetrack }: { onSelect: (val: string) => void, isRacetrack: boolean }) {
    const options = getExpertiseOptions(isRacetrack);

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
                    {isRacetrack ? "SELECT SPECIALIZATION" : "What is your primary area of expertise?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Crew assignment based on capabilities." : "This helps us match you with members needing help."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => (
                    <Card
                        key={opt.id}
                        className={cn(
                            "cursor-pointer transition-all group border",
                            isRacetrack
                                ? "bg-black/80 hover:bg-white/5 border-white/20 hover:border-signal-green rounded-none"
                                : "hover:border-primary/50 hover:shadow-lg"
                        )}
                        onClick={() => onSelect(opt.id)}
                    >
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                            <div className={cn(
                                "p-4 transition-colors",
                                isRacetrack
                                    ? "bg-white/5 group-hover:bg-signal-green/20 rounded-none w-full flex justify-center border-b border-white/10"
                                    : "rounded-full bg-secondary group-hover:bg-primary/10"
                            )}>
                                <opt.icon className={cn("w-8 h-8", isRacetrack ? "text-signal-green" : "text-primary")} />
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
// Step 2: Capacity / Role
// ----------------------------------------------------------------------

function StepCapacity({ onSelect, isRacetrack }: { onSelect: (val: string[]) => void, isRacetrack: boolean }) {
    const [selected, setSelected] = useState<string[]>([]);
    const options = getCapacityOptions(isRacetrack);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

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
                    {isRacetrack ? "ENGAGEMENT PROTOCOL" : "How do you want to contribute?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Define operational parameters (Multi-select enabled)." : "Select all the ways you'd like to engage."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => {
                    const isSelected = selected.includes(opt.id);
                    return (
                        <Card
                            key={opt.id}
                            className={cn(
                                "cursor-pointer transition-all group border",
                                isRacetrack
                                    ? cn(
                                        "bg-black/80 border-white/20 rounded-none",
                                        isSelected ? "bg-white/10 border-signal-yellow" : "hover:bg-white/5 hover:border-signal-yellow"
                                    )
                                    : cn(
                                        "hover:shadow-lg",
                                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"
                                    )
                            )}
                            onClick={() => toggleSelection(opt.id)}
                        >
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className={cn(
                                    "p-4 transition-colors",
                                    isRacetrack
                                        ? cn(
                                            "rounded-none w-full flex justify-center border-b border-white/10",
                                            isSelected ? "bg-signal-yellow/20" : "bg-white/5 group-hover:bg-signal-yellow/20"
                                        )
                                        : cn(
                                            "rounded-full",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-secondary group-hover:bg-primary/10"
                                        )
                                )}>
                                    <opt.icon className={cn("w-8 h-8",
                                        isRacetrack
                                            ? "text-signal-yellow"
                                            : isSelected ? "text-primary-foreground" : "text-primary"
                                    )} />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl font-bold", isRacetrack && "font-mono uppercase")}>{opt.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{opt.subtitle}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    className={cn(
                        "min-w-[200px]",
                        isRacetrack && "bg-signal-yellow text-black hover:bg-signal-yellow/90 font-mono tracking-wider rounded-none"
                    )}
                    disabled={selected.length === 0}
                    onClick={() => onSelect(selected)}
                >
                    {isRacetrack ? "CONFIRM PROTOCOLS" : "Continue"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 3: Info Capture
// ----------------------------------------------------------------------

function StepInfoCapture({ initialData, onSubmit, isRacetrack }: { initialData: PartnerContext['organizationInfo'] | undefined, onSubmit: (val: any) => void, isRacetrack: boolean }) {
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
// Step 4: Goal
// ----------------------------------------------------------------------

function StepGoal({ onSelect, isSubmitting, isRacetrack }: { onSelect: (val: string) => void, isSubmitting: boolean, isRacetrack: boolean }) {
    const options = getGoalOptions(isRacetrack);

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
                    {isRacetrack ? "PRIMARY OBJECTIVE" : "What brings you here today?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Mission success criteria." : "We'll align your partner invitations to this goal."}
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
                                    <opt.icon className={cn("w-8 h-8", isRacetrack ? "text-signal-green" : "text-primary")} />
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
