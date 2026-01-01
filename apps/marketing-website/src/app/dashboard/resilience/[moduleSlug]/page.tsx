"use server";

import { getModuleDetails } from "@/actions/resilience";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { ModuleCardDialog } from "@/components/resilience/ModuleCardDialog";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ModuleDetailPage({ params }: { params: { moduleSlug: string } }) {
    const { moduleSlug } = await params;
    const { module: moduleData, completions, error } = await getModuleDetails(moduleSlug);

    if (error || !moduleData) {
        // Handle not found or error
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
                <p className="text-muted-foreground mb-4">{error || "The requested module could not be found."}</p>
                <Link href="/dashboard/resilience" className="text-primary hover:underline">
                    Back to Resilience Dashboard
                </Link>
            </div>
        );
    }

    // Organize cards by section
    const sections = moduleData.sections?.sort((a: any, b: any) => a.order_index - b.order_index) || [];

    // Calculate completion stats
    const totalCards = sections.reduce((acc: number, section: any) => acc + (section.cards?.length || 0), 0);
    const completedCards = completions?.filter((c: any) => c.status === 'completed').length || 0;
    const progress = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/dashboard/resilience" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{moduleData.title}</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            {moduleData.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-lg border">
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Completion</p>
                            <p className="text-2xl font-bold">{progress}%</p>
                        </div>
                        {/* Circular progress or simple bar here if needed, but the number is clear */}
                    </div>
                </div>
            </div>

            {/* Kanban / Sections Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                {sections.map((section: any) => (
                    <div key={section.id} className="min-w-[300px] flex flex-col space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-semibold text-lg">{section.title}</h3>
                            <Badge variant="outline" className="text-xs">
                                {section.cards?.length || 0} Cards
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {section.cards?.sort((a: any, b: any) => a.order_index - b.order_index).map((card: any) => {
                                const completion = completions?.find((c: any) => c.card_id === card.id);
                                const isCompleted = completion?.status === 'completed';
                                const isInProgress = completion?.status === 'in_progress';

                                return (
                                    <ModuleCardDialog
                                        key={card.id}
                                        card={card}
                                        initialStatus={(completion?.status as "pending" | "in_progress" | "completed") || 'pending'}
                                    >
                                        <Card className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${isCompleted ? "border-l-green-500 bg-green-50/5 dark:bg-green-900/10" :
                                            isInProgress ? "border-l-yellow-500 bg-yellow-50/5 dark:bg-yellow-900/10" :
                                                "border-l-muted hover:border-l-primary"
                                            }`}>
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`font-medium leading-tight ${isCompleted ? "text-muted-foreground line-through decoration-current" : ""}`}>
                                                        {card.title}
                                                    </h4>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                                    ) : isInProgress ? (
                                                        <Circle className="w-5 h-5 text-yellow-500 shrink-0 border-2 rounded-full border-yellow-500 p-0.5" />
                                                        // Using Circle as simple indicator, or could use loader
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {card.description}
                                                </p>
                                                {isCompleted && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        Done
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </ModuleCardDialog>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
