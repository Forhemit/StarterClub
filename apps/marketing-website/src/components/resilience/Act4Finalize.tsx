"use client";

import { MobileStepLayout } from "./MobileStepLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Mic, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Act4Props {
    data: any;
    onSave: (data: any) => void;
    onComplete: () => void;
    onBack: () => void;
}

export function Act4Finalize({ data, onComplete, onBack }: Act4Props) {
    return (
        <MobileStepLayout
            title="Review & Sign"
            description="Finalize your continuity protocols."
            currentStep={4}
            totalSteps={4}
            onBack={onBack}
            onNext={onComplete}
            nextLabel="Complete Setup"
        >
            <div className="space-y-6">

                {/* Voice Memo CTA */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-blue-600 dark:text-blue-200" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">Add Voice Verification?</h4>
                            <p className="text-xs text-muted-foreground mr-2">Optional 30s recording.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Record</Button>
                </div>

                {/* Receipt Review */}
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b bg-muted/5">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Summary</h3>
                    </div>

                    {/* Item 1 */}
                    <div className="p-4 border-b flex justify-between items-center group cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Role Identity</h4>
                                <p className="text-xs text-muted-foreground">{data.role} → {data.deputy}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                    </div>

                    {/* Item 2 */}
                    <div className="p-4 border-b flex justify-between items-center group cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Protocols</h4>
                                <p className="text-xs text-muted-foreground">Tier 2: {data.tier2Action?.split('_').join(' ') || "Pending"}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                    </div>

                    {/* Item 3 */}
                    <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Assets</h4>
                                <p className="text-xs text-muted-foreground">{data.knowledgeItems?.length || 0} Domains Secured</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                    </div>
                </div>

                {/* T&C */}
                <div className="p-4 rounded-lg bg-muted/20 border text-xs text-muted-foreground">
                    <p>By completing this setup, you authorize the designated deputies to act on your behalf according to the protocols defined herein.</p>
                </div>

            </div>
        </MobileStepLayout>
    );
}
