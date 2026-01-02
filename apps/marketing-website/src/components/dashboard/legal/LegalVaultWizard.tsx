"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast"; // assuming standard hook
import { toast } from "sonner";
import { AutoSaveIndicator, type SaveStatus } from "@/components/ui/auto-save-indicator";
import { useDebounce } from "@/hooks/use-debounce";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, ArrowLeft, ArrowRight, Eye, LayoutTemplate, Sparkles, Wand2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Step1CompanyProfile } from "./Step1CompanyProfile";
import { Step2ContactInfo } from "./Step2ContactInfo";
import { Step3FormationDetails } from "./Step3FormationDetails";
import { Step4Identifiers } from "./Step4Identifiers";
import { Step5Documents } from "./Step5Documents";
import { Step6Tax } from "./Step6Tax";
import { LegalProfilePreview } from "./LegalProfilePreview";
import { LegalVaultData, LegalVaultSchema } from "./types";
import { createOrUpdateLegalEntity } from "@/actions/legal-vault"; // Keep for manual save if props not provided?
// Ideally we rely on props.
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";

const WIZARD_STEPS = [
    {
        id: "step-1",
        title: "Company Profile",
        description: "Official entity name and DBA",
        component: Step1CompanyProfile
    },
    {
        id: "step-2",
        title: "Contact Info",
        description: "Primary contact points",
        component: Step2ContactInfo
    },
    {
        id: "step-3",
        title: "Formation Details",
        description: "Entity structure and registration",
        component: Step3FormationDetails
    },
    {
        id: "step-4",
        title: "Federal & State IDs",
        description: "EIN and tax identifiers",
        component: Step4Identifiers
    },
    {
        id: "step-5",
        title: "Corporate Documents",
        description: "Operating agreements and bylaws",
        component: Step5Documents
    },
    {
        id: "step-6",
        title: "Tax Status",
        description: "IRS tax classification",
        component: Step6Tax
    }
];

interface LegalVaultWizardProps {
    initialData?: LegalVaultData;
    onSave?: (data: LegalVaultData) => Promise<void>;
    onReset?: (entityId: string) => Promise<any>;
    onComplete?: (data: LegalVaultData) => void;
    onCancel?: () => void;
}

export function LegalVaultWizard({ initialData, onSave, onReset, onComplete, onCancel }: LegalVaultWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Auto-Save State
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);

    const DEFAULT_DATA: LegalVaultData = {
        company_name: "",
        addresses: [],
        attorneys: [],
        contacts: [],
        documents: [],
        organization_type: "",
        tax_classification: "default",
        formation_in_progress: false,
        primary_state: "",
        business_purpose: "",
        naics_code: "",
        skip_business_purpose: false,
        ein: "",
        state_tax_id: "",
        state_tax_id_status: "to_do",
        duns_number: "",
        has_dba: false,
        // ... defaults handled by schema or safe access
    } as LegalVaultData;

    const [data, setData] = useState<LegalVaultData>(initialData || DEFAULT_DATA);

    const debouncedData = useDebounce(data, 1500);
    const isFirstMount = useRef(true);

    // Auto-Save Effect
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        async function autoSave() {
            if (saveStatus === "unsaved" && onSave) {
                setSaveStatus("saving");
                try {
                    await onSave(debouncedData);
                    setSaveStatus("saved");
                    setLastSaved(new Date());
                } catch (error) {
                    setSaveStatus("error");
                    toast.error("Auto-save failed");
                }
            }
        }

        autoSave();
    }, [debouncedData, onSave, saveStatus]);


    useEffect(() => {
        if (initialData) {
            setData(initialData);
            setSaveStatus("idle");
        }
    }, [initialData]);

    const handleUpdate = useCallback((updates: Partial<LegalVaultData>) => {
        setData(prev => ({ ...prev, ...updates }));
        setSaveStatus("unsaved");
    }, []);

    const handleNext = async () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            // Auto-save on step change could go here
            if (onSave) {
                // Silent save
                // await onSave(data);
            }
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Complete
            setIsLoading(true);
            try {
                if (onSave) {
                    await onSave(data);
                }

                toast.success("Legal Vault Profile Completed", {
                    description: "Your entity information has been successfully saved."
                });

                if (onComplete) onComplete(data);

                // Show the final result
                setIsPreviewMode(true);
            } catch (error) {
                toast.error("Failed to save profile", {
                    description: "Please try again later."
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Exit to marketplace or previous page
            if (onCancel) {
                onCancel();
            } else {
                router.back();
            }
        }
    };

    // Trigger the confirmation dialog
    const handleReset = () => {
        setShowResetConfirm(true);
    };

    // Actual reset logic executed after confirmation
    const confirmReset = async () => {
        setIsLoading(true);
        setShowResetConfirm(false); // Close dialog immediately or wait? Better close and show spinner if needed.

        try {
            if (data.id && onReset) {
                await onReset(data.id);
            }
            setData(DEFAULT_DATA);
            setCurrentStep(0);
            setSaveStatus("idle"); // Reset status
            toast.success("Form has been reset", {
                description: "All data has been cleared and your saved profile removed."
            });
        } catch (error) {
            toast.error("Failed to reset form");
        } finally {
            setIsLoading(false);
        }
    };

    // Derived States
    const CurrentStepComponent = WIZARD_STEPS[currentStep].component;
    const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    return (
        <ModuleErrorBoundary name="Legal Vault Module">
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Legal Vault</h1>
                        <p className="text-muted-foreground mt-1">Manage your entity's legal structure and compliance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-muted p-1 rounded-lg flex items-center border">
                            <Button
                                variant={!isPreviewMode ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setIsPreviewMode(false)}
                                className="gap-2"
                            >
                                <LayoutTemplate className="w-4 h-4" />
                                Edit
                            </Button>
                            <Button
                                variant={isPreviewMode ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setIsPreviewMode(true)}
                                className="gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleReset}
                            className="text-muted-foreground hover:text-destructive"
                            title="Reset Form"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                {isPreviewMode ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <LegalProfilePreview data={data} mode="preview" />
                    </div>
                ) : (
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                        {/* Left Sidebar (Progress) */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sticky top-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Progress
                                </h3>
                                <div className="space-y-4 relative">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-muted -z-10" />
                                    {WIZARD_STEPS.map((step, idx) => {
                                        const isActive = idx === currentStep;
                                        const isCompleted = idx < currentStep;
                                        return (
                                            <div
                                                key={step.id}
                                                className={cn(
                                                    "group flex items-start gap-3 relative cursor-pointer",
                                                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                                                )}
                                                onClick={() => setCurrentStep(idx)}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-background transition-colors bg-white",
                                                    isActive ? "border-primary text-primary" :
                                                        isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
                                                )}>
                                                    {isCompleted ? (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                                                    ) : (
                                                        <span className="text-xs font-medium">{idx + 1}</span>
                                                    )}
                                                </div>
                                                <div className="pt-0.5">
                                                    <p className={cn("text-sm font-medium leading-none", isActive && "text-primary")}>
                                                        {step.title}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Main Wizard Form */}
                        <div className="lg:col-span-9">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 md:p-8">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight">{WIZARD_STEPS[currentStep].title}</h2>
                                            <p className="text-muted-foreground">{WIZARD_STEPS[currentStep].description}</p>
                                        </div>
                                        <div className="pt-1">
                                            <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CurrentStepComponent
                                                data={data}
                                                onUpdate={handleUpdate}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between p-6 border-t bg-muted/5">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        className="gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        {currentStep === 0 ? "Back to Marketplace" : "Back"}
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button onClick={handleNext} disabled={isLoading} className="gap-2 min-w-[100px]">
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                            {currentStep === WIZARD_STEPS.length - 1 ? "Complete" : "Next Step"}
                                            {!isLoading && currentStep !== WIZARD_STEPS.length - 1 && <ArrowRight className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reset Legal Vault?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your current draft and clear all entered information.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Reset Form
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </ModuleErrorBoundary>
    );
}
