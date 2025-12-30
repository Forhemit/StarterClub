"use client";

import { useState } from "react";
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
import { ArrowLeft, ArrowRight, Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetLegalEntity } from "@/actions/legal-vault";
import { Step1CompanyProfile } from "./Step1CompanyProfile";
import { Step2ContactInfo } from "./Step2ContactInfo";
import { Step3FormationDetails } from "./Step3FormationDetails";
import { Step4Identifiers } from "./Step4Identifiers";
import { Step5Documents } from "./Step5Documents";
import { Step6Tax } from "./Step6Tax";
import { LegalProfilePreview } from "./LegalProfilePreview";

export function LegalVaultWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const [entityId, setEntityId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [previewKey, setPreviewKey] = useState(0); // Separate key for preview refresh

    const handleNext = () => setStep(Math.min(totalSteps, step + 1));
    const handlePrev = () => {
        if (step === 1) {
            router.back();
        } else {
            setStep(step - 1);
        }
    };

    const handleSave = () => {
        toast.success("Draft saved successfully!");
    };

    const handleReset = async () => {
        if (!entityId) {
            toast.info("No data to reset");
            return;
        }

        try {
            await resetLegalEntity(entityId);
            setEntityId(null);
            setStep(1);
            setResetKey(prev => prev + 1);
            toast.success("Form reset successfully!");
        } catch (error) {
            console.error("Reset failed:", error);
            toast.error("Failed to reset form. Please try again.");
        }
    };

    return (
        <TooltipProvider>
            <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
                {/* Context Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight">Legal Vault Setup</h1>
                        <p className="text-muted-foreground">Establish your corporate legal structure in 6 simple steps.</p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className={`grid gap-8 items-start transition-all duration-300 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
                    {/* Left Column: Wizard */}
                    <div className="space-y-8">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Step {step} of {totalSteps}</span>
                                <span className="hidden sm:inline">
                                    {step === 1 && "Company Profile"}
                                    {step === 2 && "Contact Info"}
                                    {step === 3 && "Formation Details"}
                                    {step === 4 && "Identifiers"}
                                    {step === 5 && "Documents"}
                                    {step === 6 && "Tax & Compliance"}
                                </span>
                            </div>
                        </div>

                        {/* Form Content */}
                        <Card className="border-0 shadow-none bg-transparent sm:border sm:bg-card sm:shadow-sm">
                            <CardHeader className="px-0 sm:px-6 flex flex-row items-start justify-between space-y-0">
                                <div className="space-y-1.5">
                                    <CardTitle>
                                        {step === 1 && "Company Profile"}
                                        {step === 2 && "Contact Information"}
                                        {step === 3 && "Formation Details"}
                                        {step === 4 && "Identifiers & Licenses"}
                                        {step === 5 && "Legal Documents"}
                                        {step === 6 && "Tax & Compliance"}
                                    </CardTitle>
                                    <CardDescription>
                                        {step === 1 && "Start with the basics of your legal entity."}
                                        {step === 2 && "How can we reach this entity?"}
                                        {step === 3 && "Details about your entity formation."}
                                        {step === 4 && "Add your EIN, state tax IDs, and other critical numbers."}
                                        {step === 5 && "Upload your filed formation documents."}
                                        {step === 6 && "Manage your tax classification and compliance status."}
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
                                            <Button variant="ghost" size="icon" onClick={handleSave}>
                                                <Save className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Save Draft</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <AlertDialog>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <RotateCcw className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Reset Form</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset Legal Vault Setup?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete your current progress and reset the form. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Reset Form
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardHeader>
                            <CardContent className="px-0 sm:px-6">
                                {step === 1 && <Step1CompanyProfile entityId={entityId} onSave={(id) => { setEntityId(id); setPreviewKey(k => k + 1); }} key={`step1-${resetKey}`} />}
                                {step === 2 && <Step2ContactInfo entityId={entityId} onSave={() => setPreviewKey(k => k + 1)} key={`step2-${resetKey}`} />}
                                {step === 3 && <Step3FormationDetails entityId={entityId} onSave={() => setPreviewKey(k => k + 1)} key={`step3-${resetKey}`} />}
                                {step === 4 && <Step4Identifiers entityId={entityId} onSave={() => setPreviewKey(k => k + 1)} key={`step4-${resetKey}`} />}
                                {step === 5 && <Step5Documents entityId={entityId} onSave={() => setPreviewKey(k => k + 1)} key={`step5-${resetKey}`} />}
                                {step === 6 && <Step6Tax key={`step6-${resetKey}`} />}
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex justify-between pt-4">
                            <Button variant="ghost" onClick={handlePrev}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {step === 1 ? "Exit" : "Back"}
                            </Button>
                            <div className="flex gap-2">
                                {step < totalSteps ? (
                                    <Button onClick={handleNext}>
                                        Next Step
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={() => console.log('Complete')}>
                                        Complete Setup
                                        <Save className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    {showPreview && (
                        <div className="hidden lg:block sticky top-8 h-[calc(100vh-100px)]">
                            <LegalProfilePreview
                                entityId={entityId}
                                lastUpdated={previewKey}
                                className="h-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
