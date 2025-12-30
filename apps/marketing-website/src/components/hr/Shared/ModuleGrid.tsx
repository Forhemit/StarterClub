"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useHRTheme } from "@/themes/hrTheme";

interface Module {
    title: string;
    icon: string;
    description: string;
    progress: number;
    color: string;
    href: string;
}

interface ModuleGridProps {
    modules: Module[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
    const { classes } = useHRTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
                <Link key={idx} href={module.href} className="block group">
                    <Card className={`h-full transition-all ${classes.cardHover} border-t-4`} style={{ borderTopColor: module.color }}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">
                                    {module.icon}
                                </span>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                                    {module.progress}%
                                </span>
                            </div>
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={module.progress} className="h-2" style={{
                                // Using generic css variable if possible, or mapping color
                                // shadcn progress uses bg-primary by default, we can override via style
                                backgroundColor: '#e2e8f0'
                            }}
                                indicatorColor={module.color}
                            />
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
