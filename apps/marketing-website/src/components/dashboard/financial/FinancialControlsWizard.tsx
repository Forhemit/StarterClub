"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Step1Settings } from "./Step1Settings";
import { Step2Accounts } from "./Step2Accounts";
import { Step3CloseItems } from "./Step3CloseItems";
import { FinancialControlsDashboard } from "./FinancialControlsDashboard";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { ModuleErrorBoundary } from "@/components/ui/module-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

export function FinancialControlsWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;
    const [dashboardKey, setDashboardKey] = useState(0);

    const handleNext = () => setStep(Math.min(totalSteps, step + 1));
    const handlePrev = () => {
        if (step === 1) {
            router.back();
        } else {
            setStep(step - 1);
        }
    };

    const handleDataChange = () => {
        setDashboardKey(prev => prev + 1);
    };

    return (
        <ModuleErrorBoundary name="Financial Controls Module">
            <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight">Financial Controls Setup</h1>
                        <p className="text-muted-foreground">Standardize your financial operations.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Step {step} of {totalSteps}</span>
                                <span>
                                    {step === 1 && "Configuration"}
                                    {step === 2 && "Chart of Accounts"}
                                    {step === 3 && "Close Checklist"}
                                </span>
                            </div>
                        </div>

                        <div className="min-h-[400px] overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    {step === 1 && <Step1Settings onSave={() => { handleDataChange(); handleNext(); }} />}
                                    {step === 2 && <Step2Accounts onSave={handleDataChange} />}
                                    {step === 3 && <Step3CloseItems onSave={handleDataChange} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="ghost" onClick={handlePrev}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {step === 1 ? "Exit" : "Back"}
                            </Button>
                            <div className="flex gap-2">
                                {step < totalSteps && (
                                    <Button onClick={handleNext}>
                                        Next Step
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                                {step === totalSteps && (
                                    <Button onClick={() => router.push('/dashboard')}>
                                        Complete Setup
                                        <Save className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block sticky top-8">
                        <div className="bg-muted/30 rounded-lg p-6 border min-h-[500px]">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                            <div className="pointer-events-none opacity-80 scale-95 origin-top-left w-full h-full text-foreground/80">
                                <FinancialControlsDashboard key={dashboardKey} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModuleErrorBoundary>
    );
}
