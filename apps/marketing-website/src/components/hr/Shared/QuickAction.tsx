"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Action {
    label: string;
    icon: LucideIcon;
    action: string;
}

interface QuickActionsPanelProps {
    actions: Action[];
    theme?: string;
}

export function QuickActionsPanel({ actions, theme }: QuickActionsPanelProps) {
    const router = useRouter();

    const handleAction = (action: string) => {
        console.log("Action triggered:", action);
        // Add routing logic here
        if (action === 'createEmployee') router.push('/dashboard/hr/onboarding');
        // etc...
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
                {actions.map((act, idx) => {
                    const IconComponent = act.icon;
                    return (
                        <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start gap-3 h-12 text-left transition-all hover:bg-muted"
                            onClick={() => handleAction(act.action)}
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50">
                                <IconComponent className="h-4 w-4" />
                            </span>
                            {act.label}
                        </Button>
                    );
                })}
            </CardContent>
        </Card>
    );
}

