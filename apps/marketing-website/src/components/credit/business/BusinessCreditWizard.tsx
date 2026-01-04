"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    Eye,
    CheckCircle2,
    Loader2,
    LayoutTemplate,
    Building2,
    ShieldAlert,
    Save,
    Trash2,
    MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { type SaveStatus } from "@/components/ui/auto-save-indicator";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";

import { Step1ComplianceChecklist } from "./Step1ComplianceChecklist";
import { Step2Tier1Vendors } from "./Step2Tier1Vendors";
import { Step3Tier2StoreCredit } from "./Step3Tier2StoreCredit";
import { Step4Tier3CashFleet } from "./Step4Tier3CashFleet";
import { Step5Tier4NonPG } from "./Step5Tier4NonPG";
import { Step6BureauMapping } from "./Step6BureauMapping";
import { BusinessCreditPreview } from "./BusinessCreditPreview";

import {
    getBusinessCreditProfile,
    saveBusinessCreditProfile,
    deleteBusinessCreditProfile,
    getTradelines
} from "@/actions/credit-actions";
import type { BusinessCreditData, Tradeline } from "../types";

const WIZARD_STEPS = [
    {
        id: "compliance",
        label: "Compliance Check",
        description: "Business credibility validation",
        component: Step1ComplianceChecklist,
        isGate: true
    },
    {
        id: "tier1",
        label: "Tier 1 Vendors",
        description: "Net-30 starter accounts",
        component: Step2Tier1Vendors
    },
    {
        id: "tier2",
        label: "Tier 2 Store Credit",
        description: "Retail store cards",
        component: Step3Tier2StoreCredit
    },
    {
        id: "tier3",
        label: "Tier 3 Cash/Fleet",
        description: "Bank & fleet cards",
        component: Step4Tier3CashFleet
    },
    {
        id: "tier4",
        label: "Tier 4 Non-PG",
        description: "Corporate credit lines",
        component: Step5Tier4NonPG
    },
    {
        id: "bureau-mapping",
        label: "Bureau IDs",
        description: "DUNS, BIN, scores",
        component: Step6BureauMapping
    }
];

export function BusinessCreditWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [previewKey, setPreviewKey] = useState(0);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const [profileData, setProfileData] = useState<BusinessCreditData>({});
    const [tradelines, setTradelines] = useState<Tradeline[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate compliance status
    const complianceScore = [
        profileData.isSosActive,
        profileData.isEinVerified,
        profileData.is411Listed,
        profileData.isAddressCommercial
    ].filter(Boolean).length * 25;

    const isComplianceComplete = complianceScore === 100;

    // Manual Save Handler
    const handleSave = useCallback(async () => {
        setSaveStatus("saving");
        try {
            const result = await saveBusinessCreditProfile(profileData);
            if (!result.success) {
                setSaveStatus("error");
                toast.error(result.error || "Failed to save");
            } else {
                setSaveStatus("saved");
                setLastSaved(new Date());
                if (result.data?.id && !profileData.id) {
                    setProfileData(prev => ({ ...prev, id: result.data!.id }));
                }
                setPreviewKey(prev => prev + 1);
                toast.success("Saved successfully!");
            }
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus("error");
            toast.error(error instanceof Error ? error.message : "Failed to save");
        }
    }, [profileData]);

    // Load existing profile on mount
    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const [existingProfile, existingTradelines] = await Promise.all([
                    getBusinessCreditProfile(),
                    getTradelines(true)
                ]);

                if (existingProfile) {
                    setProfileData(existingProfile);
                    setSaveStatus("saved");
                }
                setTradelines(existingTradelines);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const updateData = useCallback((newData: Partial<BusinessCreditData>) => {
        setProfileData(prev => ({ ...prev, ...newData }));
        setSaveStatus("unsaved");
    }, []);

    const refreshTradelines = useCallback(async () => {
        const updated = await getTradelines(true);
        setTradelines(updated);
    }, []);

    const CurrentStepComponent = WIZARD_STEPS[currentStep].component;
    const totalSteps = WIZARD_STEPS.length;

    const handleNext = () => {
        // Gate: Must complete compliance before moving to Tier 1
        if (currentStep === 0 && !isComplianceComplete) {
            toast.error("Complete all compliance items before proceeding");
            return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep === 0) {
            router.push("/dashboard/marketplace");
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const confirmReset = async () => {
        setProfileData({});
        setCurrentStep(0);
        setResetKey(prev => prev + 1);
        setSaveStatus("idle");
        setShowResetConfirm(false);
        toast.success("Form reset to defaults");
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteBusinessCreditProfile();
            if (result.success) {
                setProfileData({});
                setTradelines([]);
                setCurrentStep(0);
                setResetKey(prev => prev + 1);
                setSaveStatus("idle");
                toast.success("All data permanently deleted");
            } else {
                toast.error(result.error || "Failed to delete data");
            }
        } catch (error) {
            toast.error("Failed to delete data");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleComplete = async () => {
        setSaveStatus("saving");
        try {
            const result = await saveBusinessCreditProfile({
                ...profileData,
                completedAt: new Date().toISOString()
            });
            if (!result.success) {
                toast.error(result.error || "Failed to save");
                setSaveStatus("error");
            } else {
                setSaveStatus("saved");
                setLastSaved(new Date());
                if (result.data) {
                    setProfileData(prev => ({ ...prev, ...result.data }));
                }
                toast.success("Business Credit profile completed!");
                router.push("/dashboard/marketplace");
            }
        } catch {
            toast.error("Failed to save profile");
            setSaveStatus("error");
        }
    };

    // Calculate current tier
    const currentTier = profileData.tier4Complete ? 4 :
        profileData.tier3Complete ? 3 :
            profileData.tier2Complete ? 2 :
                profileData.tier1Complete ? 1 : 0;

    // Step indicator pills
    const StepIndicator = () => (
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
            {WIZARD_STEPS.map((step, idx) => {
                const isLocked = idx > 0 && !isComplianceComplete;

                return (
                    <Tooltip key={step.id}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => {
                                    if (isLocked) {
                                        toast.error("Complete compliance check first");
                                        return;
                                    }
                                    setCurrentStep(idx);
                                }}
                                disabled={isLocked}
                                className={`flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full border text-sm font-medium transition-all ${isLocked
                                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50'
                                    : idx === currentStep
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
                            {isLocked && <p className="text-xs text-amber-500 mt-1">🔒 Complete compliance first</p>}
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            <div className="h-px bg-border flex-1 ml-2 min-w-[20px]" />
        </div>
    );

    if (isLoading) {
        return <WizardSkeleton />;
    }

    return (
        <ModuleErrorBoundary name="Business Credit Module">
            <TooltipProvider>
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />
                <div className="space-y-8 max-w-5xl mx-auto pb-12 w-full px-6 sm:px-8 relative z-0">
                    {/* Context Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-3">
                                    <Building2 className="w-8 h-8 text-emerald-600" />
                                    Business Credit
                                </h1>
                                <Badge variant="secondary">The Tycoon</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">
                                Build business credit independent of your SSN.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Tier Badge */}
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                                {currentTier === 0 ? (
                                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium">
                                    Tier {currentTier}
                                </span>
                            </div>

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
                                    <DropdownMenuItem onClick={() => setShowResetConfirm(true)}>
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

                    {showPreview ? (
                        /* FULL SCREEN PREVIEW MODE */
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <div className="rounded-2xl border shadow-2xl shadow-black/10 bg-background/50 backdrop-blur-xl overflow-hidden ring-1 ring-border/50 h-[calc(100vh-180px)] relative">
                                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/50 to-transparent z-10 pointer-events-none" />
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                                    <BusinessCreditPreview
                                        data={profileData}
                                        tradelines={tradelines}
                                        lastUpdated={previewKey}
                                        className="min-h-full border-0 shadow-none bg-transparent max-w-5xl mx-auto"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/50 to-transparent z-10 pointer-events-none" />
                            </div>
                        </div>
                    ) : (
                        /* WIZARD MODE */
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-8">
                                <StepIndicator />

                                {/* Compliance Warning */}
                                {currentStep === 0 && !isComplianceComplete && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-amber-900 dark:text-amber-100">
                                                Complete Compliance First
                                            </h4>
                                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                                Business credit applications are often denied due to compliance issues.
                                                Complete all items below before building your credit tiers.
                                            </p>
                                        </div>
                                    </div>
                                )}

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
                                        <div className="flex items-center gap-2">
                                            {saveStatus === "unsaved" && (
                                                <Badge variant="outline" className="text-amber-600 border-amber-600">
                                                    Unsaved Changes
                                                </Badge>
                                            )}
                                            {saveStatus === "saved" && lastSaved && (
                                                <span className="text-xs text-muted-foreground">
                                                    Saved {lastSaved.toLocaleTimeString()}
                                                </span>
                                            )}
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
                                                    tradelines={tradelines}
                                                    onRefreshTradelines={refreshTradelines}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>

                                {/* Navigation */}
                                <div className="flex justify-between items-center bg-background/80 backdrop-blur-lg p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
                                    <Button variant="ghost" onClick={handlePrev} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        {currentStep === 0 ? "Back to Marketplace" : "Back"}
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleSave}
                                            disabled={saveStatus === "saving" || saveStatus === "saved"}
                                            className="min-w-[100px]"
                                        >
                                            {saveStatus === "saving" ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save"}
                                        </Button>
                                        {currentStep < totalSteps - 1 ? (
                                            <Button
                                                onClick={handleNext}
                                                disabled={currentStep === 0 && !isComplianceComplete}
                                                className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1"
                                            >
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
                        <AlertDialogTitle>Delete All Business Credit Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your business credit profile and all tradelines from the database. This action cannot be undone.
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
