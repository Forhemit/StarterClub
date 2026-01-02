"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff, Briefcase, FileText, DollarSign, Check } from "lucide-react";
import { toast } from "sonner";
import { installModule } from "@/actions/marketplace";
import { createJob, getCareerLevels, getStartingSalary, type CareerLevel } from "@/actions/jobs";
import { Step1JobBasics } from "./Step1JobBasics";
import { Step2Details } from "./Step2Details";
import { Step3Compensation } from "./Step3Compensation";
import { Step4Review } from "./Step4Review";
import { JobPostingPreview } from "./JobPostingPreview";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { WizardSkeleton } from "@/components/ui/wizard-skeleton";
import { motion, AnimatePresence } from "framer-motion";

export interface JobPostingData {
    title: string;
    department: string;
    type: string;
    remoteType: string;
    location: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
    schedule: string[];
    education: string;
    experience: string;
    salaryMin: string;
    salaryMax: string;
    salaryCurrency: string;
    salaryPeriod: string;
    internalNotes: string;
    additionalComments: string;
    // Phase 2 Fields
    jobId: string;
    jobClass: string;
    jobGrade: string; // New
    applicationDeadline: string; // Date string
    applicationLink: string;
    departmentOverview: string;
    preferredQualifications: string[];
    eeoStatement: string;
    successMetrics: string[];
    restrictions: string[];
    // Hiring Accountability
    hrLead: string;
    hiringTeamLead: string;
    hiringTeamEmail: string;
    requestingDepartment: string;
    // Partner Type
    partnerType: string;
}

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
    const [isMounted, setIsMounted] = useState(false);
    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // Configuration state
    const [jobData, setJobData] = useState<JobPostingData>(DEFAULT_JOB_DATA);
    const [careerLevels, setCareerLevels] = useState<CareerLevel[]>([]);
    const [previewPartnerName, setPreviewPartnerName] = useState<string>("");
    const [previewStartingSalary, setPreviewStartingSalary] = useState<number | undefined>(undefined);

    useEffect(() => {
        setIsMounted(true);
        // Fetch career levels on mount
        async function fetchLevels() {
            const result = await getCareerLevels();
            if (result.data) setCareerLevels(result.data);
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

    if (!isMounted) {
        return <WizardSkeleton />;
    }

    const handleInstall = async () => {
        setIsInstalling(true);
        try {
            // 1. Install Module
            const installResult = await installModule("jobs-careers");
            if (installResult.error && !installResult.error.includes("already installed")) {
                toast.error("Installation Failed", { description: installResult.error });
                return;
            }

            // 2. Create Job Posting
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
            formData.append("internal_notes", jobData.internalNotes);
            formData.append("additional_comments", jobData.additionalComments);

            // Phase 2 Fields
            formData.append("job_id", jobData.jobId);
            formData.append("job_class", jobData.jobClass);
            formData.append("job_grade", jobData.jobGrade);
            formData.append("application_deadline", jobData.applicationDeadline);
            formData.append("application_link", jobData.applicationLink);
            formData.append("department_overview", jobData.departmentOverview);
            formData.append("eeo_statement", jobData.eeoStatement);

            // Serialize arrays as JSON strings for server action to parse
            formData.append("schedule", JSON.stringify(jobData.schedule));
            formData.append("responsibilities", JSON.stringify(jobData.responsibilities));
            formData.append("qualifications", JSON.stringify(jobData.qualifications));
            formData.append("benefits", JSON.stringify(jobData.benefits));
            formData.append("preferred_qualifications", JSON.stringify(jobData.preferredQualifications));
            formData.append("success_metrics", JSON.stringify(jobData.successMetrics));
            formData.append("restrictions", JSON.stringify(jobData.restrictions));

            // Hiring Accountability
            formData.append("hr_lead", jobData.hrLead);
            formData.append("hiring_team_lead", jobData.hiringTeamLead);
            formData.append("hiring_team_email", jobData.hiringTeamEmail);
            formData.append("requesting_department", jobData.requestingDepartment || jobData.department);

            // Partner Type
            formData.append("partner_type", jobData.partnerType);

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

    const handleReset = () => {
        setStep(1);
        setJobData(DEFAULT_JOB_DATA);
        setIsInstalled(false);
        toast.info("Wizard Reset", { description: "All settings have been restored to defaults." });
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

    return (
        <ModuleErrorBoundary name="Jobs & Careers Module">
            <TooltipProvider>
                <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold font-display tracking-tight">Jobs & Careers</h1>
                                <Badge variant="secondary">Growth</Badge>
                            </div>
                            <p className="text-muted-foreground">Launch your careers page by creating your first job posting.</p>
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
                                            {step === 1 && "Define the core details of the position."}
                                            {step === 2 && "Outline responsibilities and requirements."}
                                            {step === 3 && "Set up compensation and benefits."}
                                            {step === 4 && "Review your job posting and install."}
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
                                                <Step1JobBasics data={jobData} onChange={setJobData} />
                                            )}
                                            {step === 2 && (
                                                <Step2Details data={jobData} onChange={setJobData} />
                                            )}
                                            {step === 3 && (
                                                <Step3Compensation data={jobData} onChange={setJobData} />
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
                                            Go to Jobs Dashboard
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Preview */}
                        {showPreview && (
                            <div className="hidden lg:block sticky top-8 h-[calc(100vh-100px)]">
                                <JobPostingPreview
                                    data={jobData}
                                    partnerTypeName={previewPartnerName}
                                    startingSalary={previewStartingSalary}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </ModuleErrorBoundary>
    );
}
