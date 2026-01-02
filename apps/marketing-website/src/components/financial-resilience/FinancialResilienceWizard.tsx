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
import { ArrowLeft, ArrowRight, Save, RotateCcw, Eye, EyeOff, CheckCircle2, Loader2, LayoutTemplate, Shield, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { AutoSaveIndicator, type SaveStatus } from "@/components/ui/auto-save-indicator";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useRef } from "react";
import { Step1FinancialOverview } from "./Step1FinancialOverview";
import { Step1bFinancialMetrics } from "./Step1bFinancialMetrics";
import { Step2CashFlowAnalysis } from "./Step2CashFlowAnalysis";
import { Step3StressTestScenarios } from "./Step3StressTestScenarios";
import { Step4EmergencyFund } from "./Step4EmergencyFund";
import { Step5LiquidityBuffers } from "./Step5LiquidityBuffers";
import { Step6InsuranceCoverage } from "./Step6InsuranceCoverage";
import { Step7BankingRelationships } from "./Step7BankingRelationships";
import { Step8FinancialBackupContacts } from "./Step8FinancialBackupContacts";
import { Step9RecoveryProtocols } from "./Step9RecoveryProtocols";
import { Step10FinancialControls } from "./Step10FinancialControls";
import { Step11ComplianceReview } from "./Step11ComplianceReview";
import { FinancialResiliencePreview } from "./FinancialResiliencePreview";
import { saveFinancialResilienceProfile, getFinancialResilienceProfile, FinancialResilienceData } from "@/actions/resilience";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";

const WIZARD_STEPS = [
    {
        id: "financial-overview",
        label: "Overview",
        description: "Business Profile",
        component: Step1FinancialOverview
    },
    {
        id: "financial-metrics",
        label: "Metrics",
        description: "Key Financials",
        component: Step1bFinancialMetrics
    },
    {
        id: "cash-flow",
        label: "Cash Flow",
        description: "Revenue & Expenses",
        component: Step2CashFlowAnalysis
    },
    {
        id: "stress-test",
        label: "Stress Testing",
        description: "Shock Scenarios",
        component: Step3StressTestScenarios
    },
    {
        id: "emergency-fund",
        label: "Emergency Fund",
        description: "Reserve Targets",
        component: Step4EmergencyFund
    },
    {
        id: "liquidity",
        label: "Liquidity Buffers",
        description: "Tiered Reserves",
        component: Step5LiquidityBuffers
    },
    {
        id: "insurance",
        label: "Insurance",
        description: "Coverage Review",
        component: Step6InsuranceCoverage
    },
    {
        id: "banking",
        label: "Banking",
        description: "Bank Relationships",
        component: Step7BankingRelationships
    },
    {
        id: "backup-contacts",
        label: "Backup Contacts",
        description: "Financial Succession",
        component: Step8FinancialBackupContacts
    },
    {
        id: "recovery",
        label: "Recovery Protocols",
        description: "Action Plans",
        component: Step9RecoveryProtocols
    },
    {
        id: "controls",
        label: "Financial Controls",
        description: "Signatures & Access",
        component: Step10FinancialControls
    },
    {
        id: "compliance",
        label: "Compliance",
        description: "Review & Finalize",
        component: Step11ComplianceReview
    }
];

export function FinancialResilienceWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPreview, setShowPreview] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [previewKey, setPreviewKey] = useState(0);

    const [profileData, setProfileData] = useState<FinancialResilienceData>({
        targetMonthsCoverage: 6,
        averageCollectionDays: 30,
        averagePaymentDays: 30,
        requireDualSignature: false,
        dualSignatureThreshold: 10000,
    });

    const debouncedData = useDebounce(profileData, 1500);
    const isFirstMount = useRef(true);

    // Auto-Save Effect
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        async function autoSave() {
            if (saveStatus === "unsaved") {
                setSaveStatus("saving");
                try {
                    const result = await saveFinancialResilienceProfile(debouncedData);
                    if (result.error) {
                        setSaveStatus("error");
                        toast.error("Auto-save failed");
                    } else {
                        setSaveStatus("saved");
                        setLastSaved(new Date());
                        setPreviewKey(prev => prev + 1);
                    }
                } catch (error) {
                    setSaveStatus("error");
                }
            }
        }

        autoSave();
    }, [debouncedData]);

    // Load existing profile on mount
    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const existingProfile = await getFinancialResilienceProfile();
                if (existingProfile) {
                    setProfileData(existingProfile);
                    setSaveStatus("idle");
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const updateData = useCallback((newData: Partial<FinancialResilienceData>) => {
        setProfileData(prev => ({ ...prev, ...newData }));
        setSaveStatus("unsaved");
    }, []);

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

    const handleReset = async () => {
        setProfileData({
            targetMonthsCoverage: 6,
            averageCollectionDays: 30,
            averagePaymentDays: 30,
            requireDualSignature: false,
            dualSignatureThreshold: 10000,
        });
        setCurrentStep(0);
        setResetKey(prev => prev + 1);
        setSaveStatus("unsaved");
        toast.success("Form reset to defaults");
    };

    const handleComplete = async () => {
        setSaveStatus("saving");
        try {
            const result = await saveFinancialResilienceProfile({
                ...profileData,
                completedAt: new Date().toISOString()
            });
            if (result.error) {
                toast.error(result.error);
                setSaveStatus("error");
            } else {
                setSaveStatus("saved");
                setLastSaved(new Date());
                toast.success("Financial Resilience profile completed!");
                router.push("/dashboard/resilience");
            }
        } catch (error) {
            toast.error("Failed to save profile");
            setSaveStatus("error");
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
        return <WizardSkeleton />;
    }

    return (
        <ModuleErrorBoundary name="Financial Resilience Module">
            <TooltipProvider>
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />
                <div className="space-y-8 max-w-[1200px] mx-auto pb-12 w-full px-6 sm:px-8 relative z-0">
                    {/* Context Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-3">
                                <Shield className="w-8 h-8 text-emerald-600" />
                                Financial Resilience
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">Fortify your financial position against shocks.</p>
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
                                    <FinancialResiliencePreview data={profileData} lastUpdated={previewKey} className="min-h-full border-0 shadow-none bg-transparent max-w-5xl mx-auto" />
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
                                            <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 sm:p-8 overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`step-${currentStep}-${resetKey}`}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <CurrentStepComponent
                                                    data={profileData}
                                                    onSave={updateData}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
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
                                            <Button onClick={handleComplete} disabled={saveStatus === "saving"} className="min-w-[120px] shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 transition-all hover:scale-105">
                                                {saveStatus === "saving" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
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
        </ModuleErrorBoundary>
    );
}
