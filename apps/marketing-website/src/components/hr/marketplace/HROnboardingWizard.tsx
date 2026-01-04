"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { ArrowLeft, ArrowRight, RotateCcw, Eye, LayoutTemplate, Loader2, CheckCircle2, User, Briefcase, DollarSign, ClipboardList, Package, Globe, Check, Save, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { installModule } from "@/actions/marketplace";
import { deleteHROnboardingData } from "@/actions/hr-onboarding";
import { type SaveStatus } from "@/components/ui/auto-save-indicator";
import { motion, AnimatePresence } from "framer-motion";
import {
    HROnboardingSchema,
    type EmployeeInfo,
    type PositionInfo,
    type CompensationInfo,
    type ChecklistItem,
    type EquipmentOption,
    type AccessItem
} from "./types";
import { Step1EmployeeInfo, DEFAULT_EMPLOYEE_INFO } from "./Step1EmployeeInfo";
import { Step2PositionInfo, DEFAULT_POSITION_INFO } from "./Step2PositionInfo";
import { Step3Compensation, DEFAULT_COMPENSATION_INFO } from "./Step3Compensation";
import { Step4Checklist, DEFAULT_CHECKLIST } from "./Step4Checklist";
import { Step5Equipment, DEFAULT_EQUIPMENT } from "./Step5Equipment";
import { Step6Access, DEFAULT_ACCESS } from "./Step6Access";
import { Step7Review } from "./Step7Review";
import { OnboardingLetterPreview } from "./OnboardingLetterPreview";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";

export function HROnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const totalSteps = 7;
    const progress = (step / totalSteps) * 100;

    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Save state
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);

    // Configuration state
    const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>(DEFAULT_EMPLOYEE_INFO);
    const [positionInfo, setPositionInfo] = useState<PositionInfo>(DEFAULT_POSITION_INFO);
    const [compensation, setCompensation] = useState<CompensationInfo>(DEFAULT_COMPENSATION_INFO);
    const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
    const [equipment, setEquipment] = useState<EquipmentOption[]>(DEFAULT_EQUIPMENT);
    const [access, setAccess] = useState<AccessItem[]>(DEFAULT_ACCESS);

    // Combine all form data
    const formData = { employeeInfo, positionInfo, compensation, checklist, equipment, access };

    // Load from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('hr-onboarding-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.employeeInfo) setEmployeeInfo(parsed.employeeInfo);
                if (parsed.positionInfo) setPositionInfo(parsed.positionInfo);
                if (parsed.compensation) setCompensation(parsed.compensation);
                if (parsed.checklist) setChecklist(parsed.checklist);
                if (parsed.equipment) setEquipment(parsed.equipment);
                if (parsed.access) setAccess(parsed.access);
                setSaveStatus("saved");
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
        setIsLoading(false);
    }, []);

    // Manual Save Handler
    const handleSave = useCallback(() => {
        setSaveStatus("saving");
        try {
            localStorage.setItem('hr-onboarding-draft', JSON.stringify(formData));
            setSaveStatus("saved");
            setLastSaved(new Date());
            toast.success("Draft saved!");
        } catch (error) {
            setSaveStatus("error");
            toast.error("Failed to save draft");
        }
    }, [formData]);



    // Mark as unsaved when form data changes
    const handleEmployeeInfoChange = useCallback((data: EmployeeInfo) => {
        setEmployeeInfo(data);
        setSaveStatus("unsaved");
    }, []);

    const handlePositionInfoChange = useCallback((data: PositionInfo) => {
        setPositionInfo(data);
        setSaveStatus("unsaved");
    }, []);

    const handleCompensationChange = useCallback((data: CompensationInfo) => {
        setCompensation(data);
        setSaveStatus("unsaved");
    }, []);

    const handleChecklistChange = useCallback((data: ChecklistItem[]) => {
        setChecklist(data);
        setSaveStatus("unsaved");
    }, []);

    const handleEquipmentChange = useCallback((data: EquipmentOption[]) => {
        setEquipment(data);
        setSaveStatus("unsaved");
    }, []);

    const handleAccessChange = useCallback((data: AccessItem[]) => {
        setAccess(data);
        setSaveStatus("unsaved");
    }, []);

    const handleNext = () => setStep(Math.min(totalSteps, step + 1));
    const handlePrev = () => {
        if (step === 1) {
            router.push("/dashboard/marketplace");
        } else {
            setStep(step - 1);
        }
    };

    const handleInstall = async () => {
        setIsInstalling(true);

        // 1. Zod Validation
        const fullData = {
            employeeInfo,
            positionInfo,
            compensation,
            checklist,
            equipment,
            access
        };

        const validationResult = HROnboardingSchema.safeParse(fullData);

        if (!validationResult.success) {
            setIsInstalling(false);
            const firstError = validationResult.error.issues[0];
            const errorMessage = `${firstError.path.join(" > ")}: ${firstError.message}`;
            toast.error("Validation Failed", {
                description: errorMessage,
                duration: 5000
            });
            console.error("Validation Errors:", validationResult.error.format());
            return;
        }

        try {
            // 2. Install Module
            const installResult = await installModule("hr-onboarding");
            if (installResult.error && !installResult.error.includes("already installed")) {
                toast.error("Installation Failed", { description: installResult.error });
                return;
            }

            // 3. Create Draft (Simulated Persistence)
            // In a real app, we would save to a 'onboarding_requests' table here
            // using the validated data

            setIsInstalled(true);
            setSaveStatus("saved");
            localStorage.removeItem('hr-onboarding-draft'); // Clear draft after success
            toast.success("HR Onboarding Module Installed", {
                description: "New hire process has been initiated successfully."
            });
        } catch (error) {
            console.error("Install Flow Error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsInstalling(false);
        }
    };

    const handleComplete = () => {
        router.push("/dashboard/hr/onboarding");
    };

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        setStep(1);
        setEmployeeInfo(DEFAULT_EMPLOYEE_INFO);
        setPositionInfo(DEFAULT_POSITION_INFO);
        setCompensation(DEFAULT_COMPENSATION_INFO);
        setChecklist(DEFAULT_CHECKLIST);
        setEquipment(DEFAULT_EQUIPMENT);
        setAccess(DEFAULT_ACCESS);
        setIsInstalled(false);
        setSaveStatus("idle");
        setShowResetConfirm(false);
        toast.success("Form reset to defaults");
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteHROnboardingData();
            if (result.success) {
                setStep(1);
                setEmployeeInfo(DEFAULT_EMPLOYEE_INFO);
                setPositionInfo(DEFAULT_POSITION_INFO);
                setCompensation(DEFAULT_COMPENSATION_INFO);
                setChecklist(DEFAULT_CHECKLIST);
                setEquipment(DEFAULT_EQUIPMENT);
                setAccess(DEFAULT_ACCESS);
                setIsInstalled(false);
                setSaveStatus("idle");
                localStorage.removeItem('hr-onboarding-draft');
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

    const getStepInfo = () => {
        switch (step) {
            case 1: return { label: "Employee Information", icon: <User className="w-4 h-4" /> };
            case 2: return { label: "Position Details", icon: <Briefcase className="w-4 h-4" /> };
            case 3: return { label: "Compensation & Benefits", icon: <DollarSign className="w-4 h-4" /> };
            case 4: return { label: "Onboarding Checklist", icon: <ClipboardList className="w-4 h-4" /> };
            case 5: return { label: "Equipment Provisioning", icon: <Package className="w-4 h-4" /> };
            case 6: return { label: "System Access", icon: <Globe className="w-4 h-4" /> };
            case 7: return { label: "Review & Install", icon: <Check className="w-4 h-4" /> };
            default: return { label: "", icon: null };
        }
    };

    const stepInfo = getStepInfo();

    // Standardized StepIndicator
    const StepIndicator = () => (
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
            {Array.from({ length: totalSteps }).map((_, idx) => {
                const stepNum = idx + 1;
                // HROnboarding uses dynamic step info logic
                // Use manual mapping instead of getStepInfo

                let label = "";
                let description = "";
                switch (stepNum) {
                    case 1: label = "Employee Info"; description = "Contact details"; break;
                    case 2: label = "Position"; description = "Role definitions"; break;
                    case 3: label = "Compensation"; description = "Salary & benefits"; break;
                    case 4: label = "Checklist"; description = "Onboarding tasks"; break;
                    case 5: label = "Equipment"; description = "Provisioning"; break;
                    case 6: label = "Access"; description = "System keys"; break;
                    case 7: label = "Review"; description = "Finalize"; break;
                }

                return (
                    <Tooltip key={idx}>
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
                            <p className="font-semibold">{label}</p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            <div className="h-px bg-border flex-1 ml-2 min-w-[20px]" />
        </div>
    );

    if (!isMounted || isLoading) {
        return <WizardSkeleton />;
    }

    return (
        <ModuleErrorBoundary name="HR Onboarding Module">
            <TooltipProvider>
                <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold font-display tracking-tight">HR Onboarding System</h1>
                                <Badge variant="secondary">Foundation</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">Configure your employee onboarding workflow in {totalSteps} easy steps.</p>
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
                            <OnboardingLetterPreview
                                employeeInfo={employeeInfo}
                                positionInfo={positionInfo}
                                compensation={compensation}
                                checklist={checklist}
                                equipment={equipment}
                                access={access}
                                className="h-full"
                            />
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
                                                <h2 className="text-2xl font-semibold tracking-tight">{stepInfo.label}</h2>
                                                <p className="text-muted-foreground">
                                                    {step === 1 && "Enter the new hire's contact information and expected start date."}
                                                    {step === 2 && "Define the role, department, and reporting structure."}
                                                    {step === 3 && "Set salary, bonuses, and benefits package."}
                                                    {step === 4 && "Configure onboarding tasks and sub-items."}
                                                    {step === 5 && "Select equipment to provision for the new hire."}
                                                    {step === 6 && "Configure system access and auto-provisioning."}
                                                    {step === 7 && "Review configuration and complete installation."}
                                                </p>
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
                                                key={step}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {step === 1 && (
                                                    <Step1EmployeeInfo
                                                        data={employeeInfo} // Use local state as source of truth
                                                        onChange={handleEmployeeInfoChange}
                                                    />
                                                )}
                                                {step === 2 && (
                                                    <Step2PositionInfo
                                                        data={positionInfo}
                                                        onChange={handlePositionInfoChange}
                                                    />
                                                )}
                                                {step === 3 && (
                                                    <Step3Compensation
                                                        data={compensation}
                                                        onChange={handleCompensationChange}
                                                    />
                                                )}
                                                {step === 4 && (
                                                    <Step4Checklist
                                                        checklist={checklist}
                                                        onChecklistChange={handleChecklistChange}
                                                    />
                                                )}
                                                {step === 5 && (
                                                    <Step5Equipment
                                                        equipment={equipment}
                                                        onEquipmentChange={handleEquipmentChange}
                                                    />
                                                )}
                                                {step === 6 && (
                                                    <Step6Access
                                                        access={access}
                                                        onAccessChange={handleAccessChange}
                                                    />
                                                )}
                                                {step === 7 && (
                                                    <Step7Review
                                                        checklist={checklist}
                                                        equipment={equipment}
                                                        access={access}
                                                        isInstalling={isInstalling}
                                                        isInstalled={isInstalled}
                                                        onInstall={handleInstall}
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Sticky Footer Navigation */}
                                <div className="flex justify-between items-center bg-background/80 backdrop-blur-lg p-4 rounded-xl border shadow-sm sticky bottom-4 z-20">
                                    <Button variant="ghost" onClick={handlePrev} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        {step === 1 ? "Back to Marketplace" : "Back"}
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
                                        {step < totalSteps && (
                                            <Button onClick={handleNext} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                                {step === totalSteps - 1 ? "Review" : "Next Step"}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        )}
                                        {step === totalSteps && (
                                            <Button onClick={isInstalled ? handleComplete : handleInstall} disabled={isInstalling} className="min-w-[120px] shadow-lg shadow-primary/20 transition-all hover:translate-x-1">
                                                {isInstalling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                {isInstalled ? "Go to Dashboard" : "Install Module"}
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
                        <AlertDialogTitle>Delete All HR Onboarding Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all onboarding progress and equipment requests from the database. This action cannot be undone.
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
