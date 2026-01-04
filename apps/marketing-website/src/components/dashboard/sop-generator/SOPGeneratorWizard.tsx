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
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";

// Step Components - Will be created separately
import { Step1PositionIdentification } from "./Step1PositionIdentification";
import { Step2PositionOverview } from "./Step2PositionOverview";
import { Step3KeyResponsibilities } from "./Step3KeyResponsibilities";
import { Step4AuthorityMetrics } from "./Step4AuthorityMetrics";
import { Step5Requirements } from "./Step5Requirements";
import { Step6ToolsSystems } from "./Step6ToolsSystems";
import { Step7ReviewPreview } from "./Step7ReviewPreview";
import { SOPProfilePreview } from "./SOPProfilePreview";

import {
    PositionSOPData,
    DEFAULT_SOP_DATA,
    SOPGeneratorWizardProps,
    StepProps,
    WizardStep
} from "./types";

const WIZARD_STEPS: WizardStep[] = [
    {
        id: "step-1",
        title: "Position Identification",
        description: "Title, department, and classification",
        component: Step1PositionIdentification
    },
    {
        id: "step-2",
        title: "Position Overview",
        description: "Mission and impact statements",
        component: Step2PositionOverview
    },
    {
        id: "step-3",
        title: "Key Responsibilities",
        description: "Core duties and time allocation",
        component: Step3KeyResponsibilities
    },
    {
        id: "step-4",
        title: "Authority & Metrics",
        description: "Decision authority and KPIs",
        component: Step4AuthorityMetrics
    },
    {
        id: "step-5",
        title: "Requirements",
        description: "Skills, education, and certifications",
        component: Step5Requirements
    },
    {
        id: "step-6",
        title: "Tools & Systems",
        description: "Software and platforms used",
        component: Step6ToolsSystems
    },
    {
        id: "step-7",
        title: "Review",
        description: "Final review and summary",
        component: Step7ReviewPreview
    }
];

export function SOPGeneratorWizard({ initialData, onSave, onReset, onComplete, onCancel }: SOPGeneratorWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Save State
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);

    const [data, setData] = useState<PositionSOPData>(initialData || DEFAULT_SOP_DATA);

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

    const handleUpdate = useCallback((updates: Partial<PositionSOPData>) => {
        setData(prev => ({ ...prev, ...updates }));
        setSaveStatus("unsaved");
    }, []);

    const handleNext = async () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Complete
            setIsLoading(true);
            try {
                if (onSave) {
                    await onSave(data);
                }

                toast.success("Position SOP Completed", {
                    description: "Your position SOP has been successfully saved."
                });

                if (onComplete) onComplete(data);
                setIsPreviewMode(true);
            } catch (error) {
                toast.error("Failed to save SOP", {
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
            if (onCancel) {
                onCancel();
            } else {
                router.push("/dashboard/marketplace");
            }
        }
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = async () => {
        setIsLoading(true);
        setShowResetConfirm(false);

        try {
            if (data.id && onReset) {
                await onReset(data.id);
            }
            setData(DEFAULT_SOP_DATA);
            setCurrentStep(0);
            setSaveStatus("idle");
            toast.success("Form has been reset", {
                description: "All data has been cleared."
            });
        } catch (error) {
            toast.error("Failed to reset form");
        } finally {
            setIsLoading(false);
        }
    };

    const CurrentStepComponent = WIZARD_STEPS[currentStep].component;

    // Step indicator pills
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
            <ModuleErrorBoundary name="SOP Generator Module">
                <TooltipProvider>
                    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">SOP Generator</h1>
                                <p className="text-muted-foreground mt-1">Create and manage position standard operating procedures.</p>
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
                                            setData(DEFAULT_SOP_DATA);
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
                                <SOPProfilePreview data={data} />
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
                                                        updateData={handleUpdate}
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
                                    <AlertDialogTitle>Delete All SOP Data?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete your position SOP from the database. This action cannot be undone.
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
