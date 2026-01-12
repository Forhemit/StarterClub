"use client";

import { useState, useEffect } from 'react';
import { CelebrationEffects } from '@/components/hr/Gamification/CelebrationEffects';
import { AchievementBadges } from '@/components/hr/Gamification/AchievementBadges';
import { EmployeeCard } from '@/components/hr/Interactive/EmployeeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { updateOnboardingStep, getOnboardingProgress } from "@/actions/hr-onboarding";
import { EquipmentSelector } from "@/components/hr/Onboarding/EquipmentSelector";
import { DocumentSigner } from "@/components/hr/Onboarding/DocumentSigner";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    component: React.ReactNode;
    points: number;
    badge?: string;
}

// Placeholder components
const TrainingModule = () => <div className="p-4 border border-dashed rounded bg-muted/20">Video Training Player</div>;
const TeamIntroduction = () => <div className="p-4 border border-dashed rounded bg-muted/20">Team Calendar Booking</div>;

interface OnboardingFlowProps {
    newHireId: string;
    initialProgress?: {
        completed_steps: string[];
        total_points: number;
    } | null;
}

export default function OnboardingFlow({ newHireId, initialProgress }: OnboardingFlowProps) {
    const [isLoading, setIsLoading] = useState(!initialProgress);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>(initialProgress?.completed_steps || []);
    const [totalPoints, setTotalPoints] = useState(initialProgress?.total_points || 0);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (!initialProgress) {
            getOnboardingProgress(newHireId).then(data => {
                if (data) {
                    setCompletedSteps(data.completed_steps || []);
                    setTotalPoints(data.total_points || 0);
                }
                setIsLoading(false);
            });
        }
    }, [newHireId, initialProgress]);

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: '🎉 Welcome Aboard!',
            description: 'Meet your new team member',
            component: <EmployeeCard employeeId={newHireId} />,
            points: 50,
            badge: 'first-day'
        },
        {
            id: 'paperwork',
            title: '📝 Digital Paperwork',
            description: 'E-sign documents in minutes',
            component: <DocumentSigningSectionWrapper onComplete={() => handleAutoComplete('paperwork', 100)} />,
            points: 100,
            badge: 'paperwork-pro'
        },
        {
            id: 'equipment',
            title: '💻 Equipment Setup',
            description: 'Request IT equipment',
            component: <EquipmentSelector employeeId={newHireId} onComplete={() => handleAutoComplete('equipment', 75)} />,
            points: 75,
            badge: 'tech-ready'
        },
        {
            id: 'training',
            title: '🎓 Essential Training',
            description: 'Complete required courses',
            component: <TrainingModule />,
            points: 150,
            badge: 'quick-learner'
        },
        {
            id: 'meet-team',
            title: '👥 Meet the Team',
            description: 'Schedule introductions',
            component: <TeamIntroduction />,
            points: 125,
            badge: 'team-player'
        }
    ];

    // Auto-advance helper for nested components
    const handleAutoComplete = (stepId: string, points: number) => {
        completeStep(stepId, points);
    };

    const completeStep = async (stepId: string, points: number) => {
        if (!completedSteps.includes(stepId)) {
            // Optimistic UI update
            const newTotal = totalPoints + points;
            setCompletedSteps(prev => [...prev, stepId]);
            setTotalPoints(newTotal);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);

            // Server Update
            try {
                await updateOnboardingStep(newHireId, stepId, points);
                toast.success("Progress saved!");
            } catch (error) {
                console.error(error);
                toast.error("Failed to save progress");
                // Optional: Revert state if critical
            }
        }

        if (currentStep < steps.length - 1) {
            // Delay slightly for effect
            setTimeout(() => setCurrentStep(currentStep + 1), 500);
        }
    };

    const progress = (completedSteps.length / steps.length) * 100;

    return (
        <div className="space-y-6">
            {showCelebration && <CelebrationEffects type="badge" />}

            {/* Progress Header */}
            <div className="p-6 rounded-xl shadow-lg relative overflow-hidden bg-primary">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Onboarding Adventure</h2>
                        <p className="text-white/80">Your journey starts here</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{totalPoints} pts</div>
                        <div className="text-white/80">Earned So Far</div>
                    </div>
                </div>

                <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-sm text-white mb-1">
                        <span>{Math.round(progress)}% Complete</span>
                        <span>{completedSteps.length}/{steps.length} Steps</span>
                    </div>
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${progress}% ` }}
                        />
                    </div>
                </div>
            </div>

            {/* Current Step */}
            <Card className="rounded-xl shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
                            <p className="text-muted-foreground">{steps[currentStep].description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {steps[currentStep].points} pts
                            </div>
                            <div className="text-sm">Reward</div>
                        </div>
                    </div>

                    <div className="my-6">
                        {steps[currentStep].component}
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>

                        <Button
                            onClick={() => completeStep(steps[currentStep].id, steps[currentStep].points)}
                            className="px-6"
                            disabled={completedSteps.includes(steps[currentStep].id)}
                        >
                            {completedSteps.includes(steps[currentStep].id) ? "Completed" : `Complete Step & Earn ${steps[currentStep].points} Points`}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Badges Earned */}
            <AchievementBadges
                badges={completedSteps
                    .map(stepId => steps.find(s => s.id === stepId)?.badge)
                    .filter(Boolean) as string[]}
            />

            {/* Step Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isActive = currentStep === index;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={`p - 3 rounded - lg text - center transition - all border ${isCompleted
                                ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/20'
                                : isActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'bg-muted border-transparent hover:bg-muted/80'
                                } `}
                        >
                            <div className="font-medium text-sm">{step.title.split(' ')[1]}</div>
                            <div className="text-xs mt-1">
                                {isCompleted ? '✅' : `${step.points} pts`}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

// Wrapper to pass props to DocumentSigner
function DocumentSigningSectionWrapper({ onComplete }: { onComplete: () => void }) {
    return <DocumentSigner onComplete={onComplete} />;
}
