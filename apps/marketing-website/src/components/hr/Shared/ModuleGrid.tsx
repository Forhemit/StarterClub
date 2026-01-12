"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface Module {
    title: string;
    icon: LucideIcon;
    description: string;
    progress: number;
    color: string;
    href: string;
}

interface ModuleGridProps {
    modules: Module[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => {
                const IconComponent = module.icon;
                return (
                    <Link key={idx} href={module.href} className="block group">
                        <Card className="h-full transition-all hover:translate-y-[-2px] hover:shadow-lg duration-200 border-t-4" style={{ borderTopColor: module.color }}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                        <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                                        {module.progress}%
                                    </span>
                                </div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={module.progress} className="h-2" />
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}

