"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createEmployee } from '@/actions/people-culture';
import Step1BasicInfo from '@/app/dashboard/hr/people-culture/add-employee/steps/Step1BasicInfo';
import Step2Employment from '@/app/dashboard/hr/people-culture/add-employee/steps/Step2Employment';
import Step3SystemSetup from '@/app/dashboard/hr/people-culture/add-employee/steps/Step3SystemSetup';
import Step4Review from '@/app/dashboard/hr/people-culture/add-employee/steps/Step4Review';
import { Progress } from '@/components/ui/progress';

export type EmployeeFormData = {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    departmentId: string;
    jobTitle: string;
    managerId: string; // Optional for now
    startDate: string;
    emailGenerated: string;
    selectedTools: string[];
    accessLevel: string;
    sendInvite: boolean;
};

const INITIAL_DATA: EmployeeFormData = {
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    jobTitle: '',
    managerId: '',
    startDate: new Date().toISOString().split('T')[0],
    emailGenerated: '',
    selectedTools: [],
    accessLevel: 'standard',
    sendInvite: true
};

export default function AddEmployeePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateData = (data: Partial<EmployeeFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.push('/dashboard/hr/people-culture');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await createEmployee(formData);
            if (result.success) {
                setIsSuccess(true);
                // Trigger confetti here if library available
                setTimeout(() => {
                    router.push('/dashboard/hr/people-culture');
                }, 3000);
            } else {
                console.error(result.error);
                alert("Failed to create employee: " + result.error);
            }
        } catch (e) {
            console.error(e);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (step / 4) * 100;

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Rocket className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    {formData.firstName} has been successfully added to the system. Onboarding triggers have been initiated.
                </p>
                <Button className="mt-8" onClick={() => router.push('/dashboard/hr/people-culture')}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            {/* Progress Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Employee</h1>
                    <span className="text-sm font-medium text-gray-500">Step {step} of 4</span>
                </div>
                <Progress value={progress} className="h-2 transition-all duration-500" />
            </div>

            <Card className="border-t-4 border-t-[#FF6B35] shadow-lg">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Basic Information"}
                        {step === 2 && "Employment Details"}
                        {step === 3 && "System Access & Setup"}
                        {step === 4 && "Review & Complete"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Start with the essentials. This helps us create their profile."}
                        {step === 2 && "Define their role, department, and start date."}
                        {step === 3 && "Configure their digital workspace rights and tools."}
                        {step === 4 && "Double check everything before we launch onboarding."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="min-h-[300px] pt-4">
                    {step === 1 && <Step1BasicInfo data={formData} updateData={updateData} />}
                    {step === 2 && <Step2Employment data={formData} updateData={updateData} />}
                    {step === 3 && <Step3SystemSetup data={formData} updateData={updateData} />}
                    {step === 4 && <Step4Review data={formData} />}
                </CardContent>

                <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
                    <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                        <ChevronLeft className="h-4 w-4 mr-2" /> {step === 1 ? 'Cancel' : 'Back'}
                    </Button>

                    {step < 4 ? (
                        <Button onClick={handleNext} className="bg-[#FF6B35] hover:bg-[#E85A2D]">
                            Next <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                            {isSubmitting ? "Creating..." : "Create Employee"}
                            {!isSubmitting && <Check className="h-4 w-4 ml-2" />}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
