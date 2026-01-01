
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, Save, RotateCcw, Eye, EyeOff, CheckCircle2, Loader2, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { Step1RoleMapping } from "./Step1RoleMapping";
import { Step2ResponseProtocols } from "./Step2ResponseProtocols";
import { Step3CrisisCommunication } from "./Step3CrisisCommunication";
import { Step4CriticalKnowledge } from "./Step4CriticalKnowledge";
import { Step5SpendingLimits } from "./Step5SpendingLimits";
import { Step6SigningMatrix } from "./Step6SigningMatrix";
import { Step7VoiceMemos } from "./Step7VoiceMemos";
import { Step8Relationships } from "./Step8Relationships";
import { Step9Mentoring } from "./Step9Mentoring";
import { Step10TwoPersonIntegrity } from "./Step10TwoPersonIntegrity";
import { Step11ComplianceLog } from "./Step11ComplianceLog";
import { LeadershipPreview } from "./LeadershipPreview";
import { saveLeadershipProfile, getLeadershipProfile } from "@/actions/resilience";

const WIZARD_STEPS = [
    {
        id: "role-mapping",
        label: "Role Identity",
        description: "Incumbent & Deputies",
        component: Step1RoleMapping
    },
    {
        id: "protocols",
        label: "Response Protocols",
        description: "Tiers 1-4 Actions",
        component: Step2ResponseProtocols
    },
    {
        id: "communication",
        label: "Crisis Comms",
        description: "Communication Strategy",
        component: Step3CrisisCommunication
    },
    {
        id: "knowledge",
        label: "Critical Knowledge",
        description: "Bus Factor Audit",
        component: Step4CriticalKnowledge
    },
    {
        id: "spending",
        label: "Spending Limits",
        description: "OpEx & CapEx + Approvers",
        component: Step5SpendingLimits
    },
    {
        id: "signing",
        label: "Signing Matrix",
        description: "Authority Rules (CRUD)",
        component: Step6SigningMatrix
    },
    {
        id: "voice-memos",
        label: "Voice Memos",
        description: "Knowledge Recordings",
        component: Step7VoiceMemos
    },
    {
        id: "relationships",
        label: "Relationships",
        description: "Stakeholder Handoff",
        component: Step8Relationships
    },
    {
        id: "mentoring",
        label: "Mentoring",
        description: "Successor Development",
        component: Step9Mentoring
    },
    {
        id: "two-person-integrity",
        label: "2PI Config",
        description: "Dual Signature Rules",
        component: Step10TwoPersonIntegrity
    },
    {
        id: "compliance",
        label: "Compliance Log",
        description: "Completion Tracking",
        component: Step11ComplianceLog
    }
];

export function LeadershipCapitalWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPreview, setShowPreview] = useState(true); // Default to true for desktop
    const [resetKey, setResetKey] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewKey, setPreviewKey] = useState(0);

    const [roleData, setRoleData] = useState<any>({
        interimDays: "30",
        requiresDualControl: false,
        busFactor: "medium"
    });

    // Load existing profile on mount
    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const existingProfile = await getLeadershipProfile();
                if (existingProfile) {
                    setRoleData(existingProfile);
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const updateData = (newData: any) => {
        setRoleData({ ...roleData, ...newData });
    };

    const CurrentStepComponent = WIZARD_STEPS[currentStep].component;
    const totalSteps = WIZARD_STEPS.length;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep === 0) {
            router.back();
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveLeadershipProfile(roleData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Progress saved!`);
            }
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
        // Trigger preview refresh
        setPreviewKey(k => k + 1);
    };

    const handleReset = async () => {
        setRoleData({
            interimDays: "30",
            requiresDualControl: false,
            busFactor: "medium"
        });
        setCurrentStep(0);
        setResetKey(prev => prev + 1);
        toast.success("Form reset successfully!");
    };

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            const result = await saveLeadershipProfile(roleData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Approval Workflow completed!");
                router.push("/dashboard/resilience");
            }
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    // Step indicator pills for horizontal progress
    const StepIndicator = () => (
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
            {WIZARD_STEPS.map((step, idx) => (
                <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setCurrentStep(idx)}
                            className={`flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full border text-sm font-medium transition-all ${idx === currentStep
                                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-110'
                                : idx < currentStep
                                    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                    : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-center">
                        <p className="font-semibold">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
            <div className="h-px bg-border flex-1 ml-2 min-w-[20px]" />
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (

        <TooltipProvider>
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />
            <div className="space-y-8 max-w-[1200px] mx-auto pb-12 w-full px-6 sm:px-8 relative z-0">
                {/* Context Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">Leadership Continuity</h1>
                        <p className="text-muted-foreground text-sm sm:text-base mt-1">Complete the 12-step protocol for deep resilience.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={showPreview ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="bg-background/50 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                        >
                            <LayoutTemplate className="w-4 h-4 mr-2" />
                            {showPreview ? "Back to Edit" : "Show Profile Preview"}
                        </Button>
                    </div>
                </div>

                {showPreview ? (
                    /* FULL SCREEN PREVIEW MODE */
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="rounded-2xl border shadow-2xl shadow-black/10 bg-background/50 backdrop-blur-xl overflow-hidden ring-1 ring-border/50 h-[calc(100vh-180px)] relative">
                            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/50 to-transparent z-10 pointer-events-none" />
                            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                                <LeadershipPreview data={roleData} lastUpdated={previewKey} className="min-h-full border-0 shadow-none bg-transparent max-w-5xl mx-auto" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/50 to-transparent z-10 pointer-events-none" />
                        </div>
                    </div>
                ) : (
                    /* WIZARD MODE */
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-8">
                            <StepIndicator />

                            {/* Form Content */}
                            <Card className="flex flex-col border shadow-xl shadow-black/5 ring-1 ring-border/50 bg-card/80 backdrop-blur-md overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                                <CardHeader className="px-6 py-5 border-b flex flex-row items-center justify-between space-y-0 bg-muted/20">
                                    <div className="space-y-1.5">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {currentStep + 1}
                                            </span>
                                            {WIZARD_STEPS[currentStep].label}
                                        </CardTitle>
                                        <CardDescription>{WIZARD_STEPS[currentStep].description}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving}>
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Save Progress</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 sm:p-8">
                                    <CurrentStepComponent
                                        data={roleData}
                                        onSave={updateData}
                                        key={`step-${currentStep}-${resetKey}`}
                                    />
                                </CardContent>
                            </Card>

                            {/* Navigation */}
                            <div className="flex justify-between items-center bg-background/80 backdrop-blur-lg p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
                                <Button variant="ghost" onClick={handlePrev} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {currentStep === 0 ? "Back" : "Previous"}
                                </Button>

                                <div className="flex gap-2">
                                    {currentStep < totalSteps - 1 ? (
                                        <Button onClick={handleNext} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleComplete} disabled={isSaving} className="min-w-[120px] shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 transition-all hover:scale-105">
                                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                            Complete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}

// Add custom scrollbar styles to global CSS or local style tag if needed
// .custom-scrollbar::-webkit-scrollbar { width: 4px; }

