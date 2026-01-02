"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff, User, Briefcase, DollarSign, ClipboardList, Package, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { installModule } from "@/actions/marketplace";
import { Step1EmployeeInfo, DEFAULT_EMPLOYEE_INFO, EmployeeInfo } from "./Step1EmployeeInfo";
import { Step2PositionInfo, DEFAULT_POSITION_INFO, PositionInfo } from "./Step2PositionInfo";
import { Step3Compensation, DEFAULT_COMPENSATION_INFO, CompensationInfo } from "./Step3Compensation";
import { Step4Checklist, DEFAULT_CHECKLIST, ChecklistItem } from "./Step4Checklist";
import { Step5Equipment, DEFAULT_EQUIPMENT, EquipmentOption } from "./Step5Equipment";
import { Step6Access, DEFAULT_ACCESS, AccessItem } from "./Step6Access";
import { Step7Review } from "./Step7Review";
import { OnboardingLetterPreview } from "./OnboardingLetterPreview";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

export function HROnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const totalSteps = 7;
    const progress = (step / totalSteps) * 100;

    // Configuration state
    const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>(DEFAULT_EMPLOYEE_INFO);
    const [positionInfo, setPositionInfo] = useState<PositionInfo>(DEFAULT_POSITION_INFO);
    const [compensation, setCompensation] = useState<CompensationInfo>(DEFAULT_COMPENSATION_INFO);
    const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
    const [equipment, setEquipment] = useState<EquipmentOption[]>(DEFAULT_EQUIPMENT);
    const [access, setAccess] = useState<AccessItem[]>(DEFAULT_ACCESS);

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
        try {
            const result = await installModule("hr-onboarding");
            if (result.error) {
                toast.error("Installation Failed", { description: result.error });
            } else {
                setIsInstalled(true);
                toast.success("HR Onboarding System Installed!", {
                    description: "Your configuration has been saved. Navigate to the HR Dashboard to start onboarding employees.",
                });
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsInstalling(false);
        }
    };

    const handleComplete = () => {
        router.push("/dashboard/hr/onboarding");
    };

    const handleReset = () => {
        setStep(1);
        setEmployeeInfo(DEFAULT_EMPLOYEE_INFO);
        setPositionInfo(DEFAULT_POSITION_INFO);
        setCompensation(DEFAULT_COMPENSATION_INFO);
        setChecklist(DEFAULT_CHECKLIST);
        setEquipment(DEFAULT_EQUIPMENT);
        setAccess(DEFAULT_ACCESS);
        setIsInstalled(false);
        toast.info("Wizard Reset", { description: "All settings have been restored to defaults." });
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

    return (
        <ModuleErrorBoundary name="HR Onboarding Module">
            <TooltipProvider>
                <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold font-display tracking-tight">HR Onboarding System</h1>
                                <Badge variant="secondary">Foundation</Badge>
                            </div>
                            <p className="text-muted-foreground">Configure your employee onboarding workflow in {totalSteps} easy steps.</p>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className={`grid gap-8 items-start transition-all duration-300 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
                        {/* Left Column: Wizard */}
                        <div className="space-y-6">
                            {/* Progress */}
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        {stepInfo.icon}
                                        Step {step} of {totalSteps}
                                    </span>
                                    <span>{stepInfo.label}</span>
                                </div>
                            </div>

                            {/* Form Content */}
                            <Card className="border-0 shadow-none bg-transparent sm:border sm:bg-card sm:shadow-sm">
                                <CardHeader className="px-0 sm:px-6 flex flex-row items-start justify-between space-y-0">
                                    <div className="space-y-1.5">
                                        <CardTitle>{stepInfo.label}</CardTitle>
                                        <CardDescription>
                                            {step === 1 && "Enter the new hire's contact information and expected start date."}
                                            {step === 2 && "Define the role, department, and reporting structure."}
                                            {step === 3 && "Set salary, bonuses, and benefits package."}
                                            {step === 4 && "Configure onboarding tasks and sub-items."}
                                            {step === 5 && "Select equipment to provision for the new hire."}
                                            {step === 6 && "Configure system access and auto-provisioning."}
                                            {step === 7 && "Review configuration and complete installation."}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-1 -mr-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)}>
                                                    {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{showPreview ? "Hide Preview" : "Show Preview"}</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={handleReset}>
                                                    <RotateCcw className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reset Form</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-0 sm:px-6 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={step}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            {step === 1 && (
                                                <Step1EmployeeInfo
                                                    data={employeeInfo}
                                                    onChange={setEmployeeInfo}
                                                />
                                            )}
                                            {step === 2 && (
                                                <Step2PositionInfo
                                                    data={positionInfo}
                                                    onChange={setPositionInfo}
                                                />
                                            )}
                                            {step === 3 && (
                                                <Step3Compensation
                                                    data={compensation}
                                                    onChange={setCompensation}
                                                />
                                            )}
                                            {step === 4 && (
                                                <Step4Checklist
                                                    checklist={checklist}
                                                    onChecklistChange={setChecklist}
                                                />
                                            )}
                                            {step === 5 && (
                                                <Step5Equipment
                                                    equipment={equipment}
                                                    onEquipmentChange={setEquipment}
                                                />
                                            )}
                                            {step === 6 && (
                                                <Step6Access
                                                    access={access}
                                                    onAccessChange={setAccess}
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
                                </CardContent>
                            </Card>

                            {/* Navigation */}
                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={handlePrev}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {step === 1 ? "Back to Marketplace" : "Back"}
                                </Button>
                                <div className="flex gap-2">
                                    {step < totalSteps && (
                                        <Button onClick={handleNext}>
                                            Next Step
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                    {step === totalSteps && isInstalled && (
                                        <Button onClick={handleComplete}>
                                            Go to HR Dashboard
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Preview */}
                        {showPreview && (
                            <div className="hidden lg:block sticky top-8 h-[calc(100vh-100px)]">
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
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </ModuleErrorBoundary>
    );
}
