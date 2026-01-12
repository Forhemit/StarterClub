"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Milestone {
    label: string;
    target: number;
    current: number;
}

interface ProgressJourneyProps {
    milestones: Milestone[];
    theme?: string;
}

export function ProgressJourney({ milestones }: ProgressJourneyProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Progress Journey</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {milestones.map((milestone, idx) => {
                        const percentage = Math.min((milestone.current / milestone.target) * 100, 100);
                        return (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{milestone.label}</span>
                                    <span className="text-muted-foreground">{milestone.current} / {milestone.target}</span>
                                </div>
                                <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute top-0 left-0 h-full rounded-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
