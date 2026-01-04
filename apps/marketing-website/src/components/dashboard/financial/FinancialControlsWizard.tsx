"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Step1Settings } from "./Step1Settings";
import { Step2Accounts } from "./Step2Accounts";
import { Step3CloseItems } from "./Step3CloseItems";
import { FinancialControlsDashboard } from "./FinancialControlsDashboard";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, LayoutTemplate, CheckCircle2, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { resetFinancialData } from "@/actions/financial-controls";

const WIZARD_STEPS = [
    { id: "settings", label: "Configuration", description: "Core settings" },
    { id: "accounts", label: "Chart of Accounts", description: "Account structure" },
    { id: "close", label: "Close Checklist", description: "Month-end tasks" },
];

export function FinancialControlsWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const [dashboardKey, setDashboardKey] = useState(0);
    const [showPreview, setShowPreview] = useState(false); // Default to Edit mode
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleNext = () => setStep(Math.min(totalSteps, step + 1));
    const handlePrev = () => {
        if (step === 1) {
            router.push("/dashboard/marketplace");
        } else {
            setStep(step - 1);
        }
    };

    const handleDataChange = () => {
        setDashboardKey(prev => prev + 1);
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        setStep(1);
        setDashboardKey(prev => prev + 1);
        setShowResetConfirm(false);
        toast.success("Form reset to defaults");
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await resetFinancialData();
            if (result.success) {
                setStep(1);
                setDashboardKey(prev => prev + 1);
                toast.success("All data permanently deleted");
            }
        } catch (error) {
            toast.error("Failed to delete data");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Standardized StepIndicator
    const StepIndicator = () => (
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
            {WIZARD_STEPS.map((stepItem, idx) => {
                const stepNum = idx + 1;
                return (
                    <Tooltip key={stepItem.id}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setStep(stepNum)}
                                className={`flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full border text-sm font-medium transition-all ${stepNum === step
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-110'
                                    : stepNum < step
                                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                        : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {stepNum}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-center">
                            <p className="font-semibold">{stepItem.label}</p>
                            <p className="text-xs text-muted-foreground">{stepItem.description}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            <div className="h-px bg-border flex-1 ml-2 min-w-[20px]" />
        </div>
    );

    return (
        <ModuleErrorBoundary name="Financial Controls Module">
            <TooltipProvider>
                <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold font-display tracking-tight">Financial Controls Setup</h1>
                                <Badge variant="secondary">Operations</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">Standardize your financial operations.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-muted p-1 rounded-lg flex items-center border">
                                <Button
                                    variant={!showPreview ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setShowPreview(false)}
                                    className="gap-2"
                                >
                                    <LayoutTemplate className="w-4 h-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant={showPreview ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setShowPreview(true)}
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
                                    <DropdownMenuItem onClick={handleReset}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset Form
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteConfirm(true)}
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
                    {showPreview ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-200px)]">
                            <div className="rounded-2xl border shadow-2xl shadow-black/10 bg-background/50 backdrop-blur-xl overflow-hidden ring-1 ring-border/50 h-full relative">
                                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/50 to-transparent z-10 pointer-events-none" />
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                                    <FinancialControlsDashboard key={dashboardKey} />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/50 to-transparent z-10 pointer-events-none" />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-8">
                                <StepIndicator />

                                {/* Main Wizard Form */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <div className="p-6 md:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-semibold tracking-tight">{WIZARD_STEPS[step - 1].label}</h2>
                                            <p className="text-muted-foreground">{WIZARD_STEPS[step - 1].description}</p>
                                        </div>

                                        <div className="min-h-[400px] overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={step}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {step === 1 && <Step1Settings onSave={() => { handleDataChange(); handleNext(); }} />}
                                                    {step === 2 && <Step2Accounts onSave={handleDataChange} />}
                                                    {step === 3 && <Step3CloseItems onSave={handleDataChange} />}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Sticky Footer Navigation */}
                                <div className="flex justify-between items-center bg-background/80 backdrop-blur-lg p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
                                    <Button variant="ghost" onClick={handlePrev} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        {step === 1 ? "Back to Marketplace" : "Back"}
                                    </Button>

                                    <div className="flex gap-2">
                                        {step < totalSteps && (
                                            <Button onClick={handleNext} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                                Next Step
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        )}
                                        {step === totalSteps && (
                                            <Button onClick={() => router.push('/dashboard')} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Complete Setup
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </TooltipProvider>

            <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Form?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will clear the current form data. Your saved data in the database will not be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReset}>
                            Reset Form
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete All Financial Controls Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all financial control settings, accounts, and close items from the database. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete All Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ModuleErrorBoundary>
    );
}
