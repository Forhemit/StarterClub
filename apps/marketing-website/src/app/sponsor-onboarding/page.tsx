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
    ArrowRight,
    Loader2,
    Megaphone,
    Target,
    Users,
    Briefcase,
    Lightbulb,
    CheckCircle2,
    Calendar,
    FileText,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { completeSponsorOnboarding, type SponsorContext } from "./_actions";

type Step = "value-preview" | "hot-buttons" | "info-capture" | "interest-check" | "appointment";

export default function SponsorOnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { signOut } = useClerk();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>("value-preview");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isRacetrack = mounted && theme === 'racetrack';

    const [data, setData] = useState<Partial<SponsorContext>>({
        hotButtons: [],
        partnerInterest: false,
        companyInfo: {
            name: "",
            firstName: "",
            lastName: "",
            phone: "",
            contactEmail: ""
        }
    });

    const handleHotButtonsSelect = (buttons: string[]) => {
        setData(prev => ({ ...prev, hotButtons: buttons }));
        setStep("info-capture");
    };

    const handleInfoCapture = (info: SponsorContext['companyInfo']) => {
        setData(prev => ({ ...prev, companyInfo: info }));
        setStep("interest-check");
    };

    const handlePartnerInterest = (interested: boolean) => {
        setData(prev => ({ ...prev, partnerInterest: interested }));
        setStep("appointment");
    };

    const handleFinalSubmit = async (bookCall: boolean) => {
        if (!user) {
            // Should not happen if protected properly, but fail safe
            return;
        }

        setIsSubmitting(true);
        try {
            // Ensure data is complete
            if (!data.hotButtons || !data.companyInfo) {
                throw new Error("Missing required data");
            }

            const res = await completeSponsorOnboarding({
                hotButtons: data.hotButtons,
                partnerInterest: data.partnerInterest || false,
                companyInfo: data.companyInfo,
            });

            if (res.success) {
                if (bookCall) {
                    // Redirect to booking link (placeholder)
                    window.location.href = "https://calendly.com/starter-club/sponsor-intro";
                } else {
                    window.location.href = "/dashboard";
                }
            } else {
                console.error("Failed to save context");
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setIsSubmitting(false);
        }
    };

    const stepsOrder: Step[] = ["value-preview", "hot-buttons", "info-capture", "interest-check", "appointment"];
    const currentStepIndex = stepsOrder.indexOf(step) + 1;
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
                            {stepsOrder.map((s, i) => (
                                <motion.div
                                    key={s}
                                    className={cn(
                                        "flex-1 rounded-none",
                                        i + 1 <= currentStepIndex
                                            ? "bg-signal-green shadow-[0_0_8px_rgba(0,255,157,0.5)]"
                                            : "bg-signal-green/10"
                                    )}
                                    initial={false}
                                    animate={{
                                        opacity: i + 1 <= currentStepIndex ? 1 : 0.3,
                                        backgroundColor: i + 1 <= currentStepIndex ? "rgb(0, 255, 157)" : "rgba(0, 255, 157, 0.1)"
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
                    {step === "value-preview" && (
                        <StepValuePreview key="value-preview" onNext={() => setStep("hot-buttons")} isRacetrack={isRacetrack} />
                    )}
                    {step === "hot-buttons" && (
                        <StepHotButtons key="hot-buttons" onSelect={handleHotButtonsSelect} isRacetrack={isRacetrack} />
                    )}
                    {step === "info-capture" && (
                        <StepInfoCapture key="info-capture" initialData={data.companyInfo} onSubmit={handleInfoCapture} isRacetrack={isRacetrack} />
                    )}
                    {step === "interest-check" && (
                        <StepInterestCheck key="interest-check" onSelect={handlePartnerInterest} isRacetrack={isRacetrack} />
                    )}
                    {step === "appointment" && (
                        <StepAppointment
                            key="appointment"
                            onSubmit={handleFinalSubmit}
                            partnerInterest={data.partnerInterest || false}
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
// Step 1: Sponsor Value Preview
// ----------------------------------------------------------------------

function StepValuePreview({ onNext, isRacetrack }: { onNext: () => void, isRacetrack: boolean }) {
    const benefits = [
        { text: "High-trust brand placement inside an active builder community", icon: Megaphone },
        { text: "Contextual visibility (members see why you matter)", icon: Target },
        { text: "Sponsored moments, not banner ads", icon: Star },
        { text: "Association with credible operators", icon: Users },
        { text: "Alignment with long-term business journeys", icon: Briefcase },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 max-w-2xl mx-auto"
        >
            <div className="text-center space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "SPONSOR STARTER CLUB" : "Sponsor Starter Club"}
                </h1>
                <p className={cn("text-xl max-w-xl mx-auto", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "ESTABLISH BRAND PRESENCE IN THE GRID." : "Be present where real businesses are being built."}
                </p>
            </div>

            <Card className={cn(
                "overflow-hidden border",
                isRacetrack ? "bg-black/80 border-white/20 rounded-none" : "bg-card"
            )}>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <h3 className={cn("text-lg font-semibold", isRacetrack && "uppercase font-mono text-signal-green")}>
                            {isRacetrack ? "CONNECTION PROTOCOLS" : "What Sponsors Actually Get"}
                        </h3>
                        <ul className="space-y-3">
                            {benefits.map((b, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className={cn("mt-1", isRacetrack ? "text-signal-green" : "text-primary")}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className={isRacetrack ? "font-mono" : ""}>{b.text}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className={cn("p-4 rounded-lg text-sm", isRacetrack ? "bg-signal-green/10 text-signal-green font-mono border border-signal-green/20" : "bg-muted text-muted-foreground italic")}>
                        {isRacetrack ? "NOTE: ENDORSEMENT BY PROXIMITY." : "This isn’t exposure. It’s endorsement by proximity."}
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
                    onClick={onNext}
                >
                    {isRacetrack ? "PROCEED TO CONFIGURATION" : "Continue"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 2: Hot Buttons
// ----------------------------------------------------------------------

function StepHotButtons({ onSelect, isRacetrack }: { onSelect: (val: string[]) => void, isRacetrack: boolean }) {
    const [selected, setSelected] = useState<string[]>([]);
    const options = [
        { id: "visibility", text: "Brand visibility & awareness", icon: Megaphone },
        { id: "early_stage", text: "Reaching early-stage founders", icon: Target },
        { id: "quality_ops", text: "Association with quality operators", icon: Users },
        { id: "events", text: "Sponsored events & experiences", icon: Calendar },
        { id: "thought_lead", text: "Thought leadership & credibility", icon: Lightbulb },
        { id: "long_term", text: "Long-term ecosystem alignment", icon: Briefcase },
    ];

    const toggleSelection = (id: string) => {
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id);
            if (prev.length >= 3) return prev; // Max 3
            return [...prev, id];
        });
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
                    {isRacetrack ? "TARGET VECTORS" : "What’s most important to you as a sponsor?"}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Select up to 3 priority objectives." : "We design sponsorships around outcomes, not logos."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className={cn(
                                    "p-3 transition-colors rounded-full",
                                    isRacetrack
                                        ? cn(
                                            isSelected ? "bg-signal-yellow/20 text-signal-yellow" : "bg-white/5 text-muted-foreground"
                                        )
                                        : cn(
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                                        )
                                )}>
                                    <opt.icon className="w-6 h-6" />
                                </div>
                                <span className={cn("font-medium", isRacetrack && "font-mono")}>{opt.text}</span>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    className={cn(
                        "min-w-[200px] h-14 text-lg",
                        isRacetrack
                            ? "bg-signal-yellow text-black hover:bg-signal-yellow/90 font-mono tracking-wider rounded-none"
                            : "rounded-full"
                    )}
                    disabled={selected.length === 0}
                    onClick={() => onSelect(selected)}
                >
                    {isRacetrack ? "CONFIRM VECTORS" : "Continue"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 3: Info Capture
// ----------------------------------------------------------------------

function StepInfoCapture({ initialData, onSubmit, isRacetrack }: { initialData: SponsorContext['companyInfo'] | undefined, onSubmit: (val: any) => void, isRacetrack: boolean }) {
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
// Step 4: Interest Check
// ----------------------------------------------------------------------

function StepInterestCheck({ onSelect, isRacetrack }: { onSelect: (val: boolean) => void, isRacetrack: boolean }) {

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
                    {isRacetrack ? "ENGAGEMENT DEPTH" : "Some sponsors choose to engage more deeply."}
                </h1>
                <p className={cn("text-xl max-w-2xl mx-auto", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Select tactical or strategic deployment." : "We're not upselling you. We're asking how you want to show up."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Standard Sponsor */}
                <Card className={cn(
                    "border flex flex-col",
                    isRacetrack ? "bg-black/80 border-white/20 rounded-none" : "bg-card hover:shadow-lg transition-shadow"
                )}>
                    <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                        <div className="space-y-2">
                            <h3 className={cn("text-2xl font-bold", isRacetrack && "font-mono uppercase text-signal-green")}>
                                Sponsor
                            </h3>
                            <p className="text-muted-foreground">Focus on brand visibility and alignment.</p>
                        </div>
                        <ul className="space-y-3 flex-1">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Brand placement</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Sponsored moments</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Visibility across journeys</span>
                            </li>
                        </ul>
                        <Button
                            variant={isRacetrack ? "outline" : "secondary"}
                            className={cn("w-full h-12", isRacetrack && "rounded-none border-signal-green text-signal-green hover:bg-signal-green hover:text-black font-mono")}
                            onClick={() => onSelect(false)}
                        >
                            Stay a Sponsor
                        </Button>
                    </CardContent>
                </Card>

                {/* Partner + Sponsor */}
                <Card className={cn(
                    "border flex flex-col relative overflow-hidden",
                    isRacetrack ? "bg-black/80 border-signal-yellow rounded-none" : "bg-primary/5 border-primary hover:shadow-lg transition-shadow"
                )}>
                    {isRacetrack && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-signal-yellow rounded-full animate-pulse"></div></div>}

                    <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                        <div className="space-y-2">
                            <h3 className={cn("text-2xl font-bold", isRacetrack && "font-mono uppercase text-signal-yellow")}>
                                Sponsor + Partner
                            </h3>
                            <p className="text-muted-foreground">Strategic depth and direct engagement.</p>
                        </div>
                        <ul className="space-y-3 flex-1">
                            <li className="flex items-center gap-2">
                                <Star className={cn("w-4 h-4", isRacetrack ? "text-signal-yellow" : "text-primary")} />
                                <span>Direct engagement with members</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className={cn("w-4 h-4", isRacetrack ? "text-signal-yellow" : "text-primary")} />
                                <span>Hosting workshops or sessions</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className={cn("w-4 h-4", isRacetrack ? "text-signal-yellow" : "text-primary")} />
                                <span>Long-term ecosystem involvement</span>
                            </li>
                        </ul>
                        <Button
                            className={cn("w-full h-12", isRacetrack ? "rounded-none bg-signal-yellow text-black hover:bg-signal-yellow/90 font-mono" : "")}
                            onClick={() => onSelect(true)}
                        >
                            I'm interested in venturing too
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Step 5: Appointment
// ----------------------------------------------------------------------

function StepAppointment({ onSubmit, partnerInterest, isSubmitting, isRacetrack }: { onSubmit: (book: boolean) => void, partnerInterest: boolean, isSubmitting: boolean, isRacetrack: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 max-w-2xl mx-auto text-center"
        >
            <div className="space-y-4">
                <h1 className={cn(
                    "text-3xl md:text-5xl font-bold tracking-tight",
                    isRacetrack ? "font-heading uppercase tracking-tighter" : ""
                )}>
                    {isRacetrack ? "INITIATE SEQUENCE" : "Let’s explore what makes sense."}
                </h1>
                <p className={cn("text-xl", isRacetrack ? "text-muted-foreground font-mono" : "text-muted-foreground")}>
                    {isRacetrack ? "Sync with control tower." : "20–30 minute conversation. No deck required."}
                </p>
            </div>

            <Card className={cn(
                "border text-left",
                isRacetrack ? "bg-black/80 border-white/20 rounded-none" : "bg-card"
            )}>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="font-semibold">We'll walk through:</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                <span>Sponsor options & current opportunities</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                <span>Alignment with your goals</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                <span>Timing and next steps</span>
                            </li>
                            {partnerInterest && (
                                <li className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span>Partner involvement possibilities</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                    size="lg"
                    className={cn(
                        "h-14 text-lg",
                        isRacetrack
                            ? "bg-signal-green text-black hover:bg-signal-green/90 font-mono tracking-wider rounded-none"
                            : "rounded-full"
                    )}
                    disabled={isSubmitting}
                    onClick={() => onSubmit(true)}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Calendar className="mr-2 h-5 w-5" />}
                    Book a Sponsor Intro Call
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                        "h-14 text-lg",
                        isRacetrack
                            ? "border-white/20 text-white hover:bg-white/10 font-mono rounded-none"
                            : "rounded-full"
                    )}
                    disabled={isSubmitting}
                    onClick={() => onSubmit(false)}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
                    Send me info first
                </Button>
            </div>
        </motion.div>
    );
}
