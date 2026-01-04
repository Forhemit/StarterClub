"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type SaveStatus } from "@/components/ui/auto-save-indicator";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, ArrowLeft, ArrowRight, Eye, LayoutTemplate, RotateCcw, CheckCircle2, Save, Trash2, MoreVertical } from "lucide-react";
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
import { createOrUpdateLegalEntity } from "@/actions/legal-vault";
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
    const [isMounted, setIsMounted] = useState(false);
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

    // Manual Save Handler
    const handleSave = useCallback(async () => {
        if (!onSave) return;
        setSaveStatus("saving");
        try {
            await onSave(data);
            setSaveStatus("saved");
            setLastSaved(new Date());
            toast.success("Saved successfully!");
        } catch (error) {
            setSaveStatus("error");
            toast.error("Failed to save");
        }
    }, [data, onSave]);

    useEffect(() => {
        if (initialData) {
            setData(initialData);
            setSaveStatus("saved");
        }
    }, [initialData]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                router.push("/dashboard/marketplace");
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
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
            <div className="h-px bg-border flex-1 ml-2 min-w-[20px]" />
        </div>
    );

    return (
        !isMounted ? <WizardSkeleton /> :
            <ModuleErrorBoundary name="Legal Vault Module">
                <TooltipProvider>
                    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">Legal Vault</h1>
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

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground"
                                            title="Options"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setData(DEFAULT_DATA);
                                            setCurrentStep(0);
                                            setSaveStatus("idle");
                                            toast.success("Form reset to defaults");
                                        }}>
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Reset Form
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleReset}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete All Data
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Content Area */}
                        {isPreviewMode ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <LegalProfilePreview data={data} mode="preview" />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-8">
                                    <StepIndicator />

                                    {/* Main Wizard Form */}
                                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                        <div className="p-6 md:p-8">
                                            <div className="mb-6 flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-2xl font-semibold tracking-tight">{WIZARD_STEPS[currentStep].title}</h2>
                                                    <p className="text-muted-foreground">{WIZARD_STEPS[currentStep].description}</p>
                                                </div>
                                                <div className="pt-1 flex items-center gap-2">
                                                    {saveStatus === "unsaved" && (
                                                        <span className="text-xs text-amber-600">Unsaved changes</span>
                                                    )}
                                                    {saveStatus === "saved" && lastSaved && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Saved {lastSaved.toLocaleTimeString()}
                                                        </span>
                                                    )}
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
                                    </div>

                                    {/* Sticky Footer Navigation */}
                                    <div className="flex justify-between items-center bg-background/80 backdrop-blur-lg p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
                                        <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            {currentStep === 0 ? "Back to Marketplace" : "Back"}
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={handleSave}
                                                disabled={saveStatus === "saving" || saveStatus === "saved" || !onSave}
                                                className="min-w-[100px]"
                                            >
                                                {saveStatus === "saving" ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save"}
                                            </Button>
                                            <Button onClick={handleNext} disabled={isLoading} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
                                                    (currentStep === WIZARD_STEPS.length - 1 ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null)
                                                }
                                                {currentStep === WIZARD_STEPS.length - 1 ? "Complete" : "Next Step"}
                                                {!isLoading && currentStep !== WIZARD_STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete All Legal Vault Data?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete your legal entity profile from the database. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmReset} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                        Delete All Data
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TooltipProvider>
            </ModuleErrorBoundary>
    );
}
