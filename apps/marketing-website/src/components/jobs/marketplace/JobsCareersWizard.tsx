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
import { ArrowLeft, ArrowRight, RotateCcw, Eye, LayoutTemplate, Loader2, CheckCircle2, Briefcase, FileText, DollarSign, Check, Save, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { installModule } from "@/actions/marketplace";
import { type SaveStatus } from "@/components/ui/auto-save-indicator";
import { createJob, getCareerLevels, getStartingSalary, deleteAllJobPostings, type CareerLevel } from "@/actions/jobs";
import { Step1JobBasics } from "./Step1JobBasics";
import { Step2Details } from "./Step2Details";
import { Step3Compensation } from "./Step3Compensation";
import { Step4Review } from "./Step4Review";
import { JobPostingPreview } from "./JobPostingPreview";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { JobPostingSchema, type JobPostingData } from "./types";

// Removed inline interface definition in favor of imported Zod type


export const DEFAULT_JOB_DATA: JobPostingData = {
    title: "",
    department: "",
    type: "Full-time",
    remoteType: "On-site",
    location: "",
    description: "",
    responsibilities: [],
    qualifications: [],
    benefits: [],
    schedule: [],
    education: "Bachelor's Degree",
    experience: "Mid-Level (3-5 years)",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    internalNotes: "",
    additionalComments: "",
    // Phase 2 Defaults
    jobId: "",
    jobClass: "",
    jobGrade: "",
    applicationDeadline: "",
    applicationLink: "",
    departmentOverview: "",
    preferredQualifications: [],
    eeoStatement: "We are an equal opportunity employer and value diversity at our company. We do not discriminate on the basis of race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status.",
    successMetrics: [],
    restrictions: [],
    // Accountability Defaults
    hrLead: "",
    hiringTeamLead: "",
    hiringTeamEmail: "",
    requestingDepartment: "",
    // Partner Type Default
    partnerType: "",
};

export function JobsCareersWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // Configuration state
    const [jobData, setJobData] = useState<JobPostingData>(DEFAULT_JOB_DATA);
    const [careerLevels, setCareerLevels] = useState<CareerLevel[]>([]);
    const [previewPartnerName, setPreviewPartnerName] = useState<string>("");
    const [previewStartingSalary, setPreviewStartingSalary] = useState<number | undefined>(undefined);

    // Save state
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('jobs-careers-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setJobData(parsed);
                setSaveStatus("saved");
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Manual Save Handler
    const handleSave = useCallback(() => {
        setSaveStatus("saving");
        try {
            localStorage.setItem('jobs-careers-draft', JSON.stringify(jobData));
            setSaveStatus("saved");
            setLastSaved(new Date());
            toast.success("Draft saved!");
        } catch (error) {
            setSaveStatus("error");
            toast.error("Failed to save draft");
        }
    }, [jobData]);

    // Handler that marks unsaved
    const handleJobDataChange = useCallback((updates: JobPostingData) => {
        setJobData(updates);
        setSaveStatus("unsaved");
    }, []);

    useEffect(() => {
        setIsMounted(true);
        // Fetch career levels on mount
        async function fetchLevels() {
            const result = await getCareerLevels();
            if (result.data) setCareerLevels(result.data);
            setIsLoading(false);
        }
        fetchLevels();
    }, []);



    // Update partner name when partnerType changes
    useEffect(() => {
        if (jobData.partnerType && careerLevels.length > 0) {
            const level = careerLevels.find(l => l.id === jobData.partnerType);
            setPreviewPartnerName(level?.name || "");
        } else {
            setPreviewPartnerName("");
        }
    }, [jobData.partnerType, careerLevels]);

    // Fetch starting salary when partnerType and jobClass change
    useEffect(() => {
        async function fetchSalary() {
            if (jobData.partnerType && jobData.jobClass) {
                const result = await getStartingSalary(jobData.partnerType, jobData.jobClass);
                if (result.data) {
                    setPreviewStartingSalary(result.data.baseSalary);
                } else {
                    setPreviewStartingSalary(undefined);
                }
            } else {
                setPreviewStartingSalary(undefined);
            }
        }
        fetchSalary();
    }, [jobData.partnerType, jobData.jobClass]);

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
            // 1. Zod Validation
            const validationResult = JobPostingSchema.safeParse(jobData);
            if (!validationResult.success) {
                setIsInstalling(false);
                const firstError = validationResult.error.issues[0];
                const errorMessage = `${firstError.path.join(" > ")}: ${firstError.message}`;
                toast.error("Validation Failed", {
                    description: errorMessage,
                    duration: 5000
                });
                return;
            }

            // 2. Install Module
            const installResult = await installModule("jobs-careers");
            if (installResult.error && !installResult.error.includes("already installed")) {
                toast.error("Installation Failed", { description: installResult.error });
                return;
            }

            // 3. Create Job Posting
            const formData = new FormData();
            formData.append("title", jobData.title);
            formData.append("department", jobData.department);
            formData.append("type", jobData.type);
            formData.append("remote_type", jobData.remoteType);
            formData.append("location", jobData.location);
            formData.append("description", jobData.description);
            formData.append("salary_min", jobData.salaryMin);
            formData.append("salary_max", jobData.salaryMax);
            formData.append("salary_currency", jobData.salaryCurrency);
            formData.append("salary_period", jobData.salaryPeriod);
            formData.append("education", jobData.education);
            formData.append("experience", jobData.experience);
            formData.append("internal_notes", jobData.internalNotes || "");
            formData.append("additional_comments", jobData.additionalComments || "");

            // Phase 2 Fields
            formData.append("job_id", jobData.jobId || "");
            formData.append("job_class", jobData.jobClass || "");
            formData.append("job_grade", jobData.jobGrade || "");
            formData.append("application_deadline", jobData.applicationDeadline || "");
            formData.append("application_link", jobData.applicationLink || "");
            formData.append("department_overview", jobData.departmentOverview || "");
            formData.append("eeo_statement", jobData.eeoStatement || "");

            // Serialize arrays as JSON strings for server action to parse
            formData.append("schedule", JSON.stringify(jobData.schedule || []));
            formData.append("responsibilities", JSON.stringify(jobData.responsibilities || []));
            formData.append("qualifications", JSON.stringify(jobData.qualifications || []));
            formData.append("benefits", JSON.stringify(jobData.benefits || []));
            formData.append("preferred_qualifications", JSON.stringify(jobData.preferredQualifications || []));
            formData.append("success_metrics", JSON.stringify(jobData.successMetrics || []));
            formData.append("restrictions", JSON.stringify(jobData.restrictions || []));

            // Hiring Accountability
            formData.append("hr_lead", jobData.hrLead || "");
            formData.append("hiring_team_lead", jobData.hiringTeamLead || "");
            formData.append("hiring_team_email", jobData.hiringTeamEmail || "");
            formData.append("requesting_department", jobData.requestingDepartment || jobData.department || "");

            // Partner Type
            formData.append("partner_type", jobData.partnerType || "");

            const jobResult = await createJob(formData);
            if (jobResult?.error) {
                toast.error("Job Creation Failed", { description: jobResult.error });
                return;
            }

            setIsInstalled(true);
            toast.success("Module Installed & Job Posted!", {
                description: "Your careers page is live and your first job has been posted.",
            });

        } catch (error) {
            console.error("Install Flow Error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsInstalling(false);
        }
    };

    const handleComplete = () => {
        router.push("/dashboard/jobs");
    };

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        setStep(1);
        setJobData(DEFAULT_JOB_DATA);
        setIsInstalled(false);
        setSaveStatus("idle");
        setShowResetConfirm(false);
        toast.success("Form reset to defaults");
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAllJobPostings();
            if (result.success) {
                setStep(1);
                setJobData(DEFAULT_JOB_DATA);
                setIsInstalled(false);
                setSaveStatus("idle");
                localStorage.removeItem('jobs-careers-draft');
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
            case 1: return { label: "Role Basics", icon: <Briefcase className="w-4 h-4" /> };
            case 2: return { label: "Details", icon: <FileText className="w-4 h-4" /> };
            case 3: return { label: "Compensation", icon: <DollarSign className="w-4 h-4" /> };
            case 4: return { label: "Review & Install", icon: <Check className="w-4 h-4" /> };
            default: return { label: "", icon: null };
        }
    };

    const stepInfo = getStepInfo();

    // Standardized StepIndicator
    const StepIndicator = () => (
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
            {Array.from({ length: totalSteps }).map((_, idx) => {
                const stepNum = idx + 1;
                // Jobs uses dynamic step info logic
                let label = "";
                let description = "";
                switch (stepNum) {
                    case 1: label = "Role Basics"; description = "Title & Dept"; break;
                    case 2: label = "Details"; description = "Requirements"; break;
                    case 3: label = "Compensation"; description = "Salary & Benefits"; break;
                    case 4: label = "Review"; description = "Finalize"; break;
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
        <ModuleErrorBoundary name="Jobs & Careers Module">
            <TooltipProvider>
                <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold font-display tracking-tight">Jobs & Careers</h1>
                                <Badge variant="secondary">Growth</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">Launch your careers page by creating your first job posting.</p>
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
                            <JobPostingPreview
                                data={jobData}
                                partnerTypeName={previewPartnerName}
                                startingSalary={previewStartingSalary}
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
                                                    {step === 1 && "Define the core details of the position."}
                                                    {step === 2 && "Outline responsibilities and requirements."}
                                                    {step === 3 && "Set up compensation and benefits."}
                                                    {step === 4 && "Review your job posting and install."}
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
                                                    <Step1JobBasics data={jobData} onChange={handleJobDataChange} />
                                                )}
                                                {step === 2 && (
                                                    <Step2Details data={jobData} onChange={handleJobDataChange} />
                                                )}
                                                {step === 3 && (
                                                    <Step3Compensation data={jobData} onChange={handleJobDataChange} />
                                                )}
                                                {step === 4 && (
                                                    <Step4Review
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
                        <AlertDialogTitle>Delete All Job Postings?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all job postings for your organization from the database. This action cannot be undone.
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
