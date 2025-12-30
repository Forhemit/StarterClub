"use client";

import { useHRTheme } from "@/themes/hrTheme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Play, CheckCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Action {
    label: string;
    icon: string;
    action: string;
}

interface QuickActionsPanelProps {
    actions: Action[];
    theme?: string;
}

export function QuickActionsPanel({ actions, theme }: QuickActionsPanelProps) {
    const { colors, isRacetrack } = useHRTheme();
    const router = useRouter();

    const getIcon = (iconStr: string) => {
        switch (iconStr) {
            case '➕': return <Plus className="h-4 w-4" />;
            case '🎯': return <Play className="h-4 w-4" />;
            case '✅': return <CheckCircle className="h-4 w-4" />;
            case '📋': return <FileText className="h-4 w-4" />;
            default: return <Plus className="h-4 w-4" />;
        }
    };

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
                {actions.map((act, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 text-left transition-all hover:bg-muted"
                        onClick={() => handleAction(act.action)}
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50">
                            {getIcon(act.icon)}
                        </span>
                        {act.label}
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
