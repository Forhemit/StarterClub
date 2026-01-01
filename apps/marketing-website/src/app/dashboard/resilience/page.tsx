"use server";

import { getResilienceModules, getResilienceScore } from "@/actions/resilience";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default async function ResilienceDashboardPage() {
    const { modules, installed } = await getResilienceModules();
    const overallScore = await getResilienceScore();

    // Filter modules to only those that are installed or available (for now, list all resilience modules)
    // We want to show installed ones with progress, and maybe available ones as "Recommended"

    // For the dashboard, we primarily focus on installed ones to show progress
    // If nothing installed, prompt to go to marketplace

    const installedModules = modules.filter(m => installed.includes(m.id));
    const availableModules = modules.filter(m => !installed.includes(m.id));

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Business Resilience</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and improve your organization's ability to withstand shocks.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/marketplace" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Browse Marketplace
                    </Link>
                </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle>Resilience Score</CardTitle>
                        <CardDescription>Overall readiness rating</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-muted/20"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 60}
                                    strokeDashoffset={2 * Math.PI * 60 * (1 - (overallScore as number) / 100)}
                                    className={getScoreColor(overallScore as number)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className={`absolute text-4xl font-bold ${getScoreColor(overallScore as number)}`}>
                                {overallScore}%
                            </span>
                        </div>
                        <p className="text-sm text-center text-muted-foreground mt-4">
                            {overallScore && overallScore >= 80 ? "Excellent. You are well prepared." :
                                overallScore && overallScore >= 50 ? "Good start. Keep improving." : "Critical gaps detected."}
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Modules</CardTitle>
                        <CardDescription>Track your progress across installed resilience domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {installedModules.length > 0 ? (
                            <div className="space-y-6">
                                {installedModules.map((module) => (
                                    <div key={module.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/dashboard/resilience/${module.slug}`} className="font-medium hover:underline flex items-center gap-2">
                                                {module.title}
                                                <ArrowRight className="w-4 h-4 opacity-50" />
                                            </Link>
                                            <span className="text-sm text-muted-foreground">0%</span> {/* TODO: Fetch individual module scores */}
                                        </div>
                                        <Progress value={0} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No resilience modules installed.</p>
                                <Link href="/dashboard/marketplace" className="text-primary hover:underline mt-2 inline-block">
                                    Go to Marketplace to install modules
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations / Available Modules */}
            {availableModules.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Recommended Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableModules.map((module) => (
                            <Card key={module.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{module.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto pt-0">
                                    <Link
                                        href="/dashboard/marketplace"
                                        className="text-sm font-medium text-primary hover:underline flex items-center"
                                    >
                                        Install from Marketplace <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
