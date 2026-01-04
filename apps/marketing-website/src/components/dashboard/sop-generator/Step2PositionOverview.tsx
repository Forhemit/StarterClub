"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "./types";

export function Step2PositionOverview({ data, updateData }: StepProps) {
    const missionLength = data.mission_statement?.length || 0;
    const impactLength = data.impact_statement?.length || 0;
    const maxLength = 500;

    return (
        <div className="space-y-8">
            {/* Mission Statement */}
            <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <Label htmlFor="mission_statement" className="text-base font-medium">
                        Mission Statement
                    </Label>
                    <span className={`text-xs ${missionLength > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {missionLength}/{maxLength}
                    </span>
                </div>
                <Textarea
                    id="mission_statement"
                    placeholder="Describe the core purpose and mission of this position. What is the primary reason this role exists?"
                    value={data.mission_statement || ""}
                    onChange={(e) => updateData({ mission_statement: e.target.value })}
                    className="h-[150px] resize-none"
                />
                <p className="text-sm text-muted-foreground">
                    Example: "To lead the engineering team in delivering high-quality software solutions that drive customer success and business growth."
                </p>
            </div>

            {/* Impact Statement */}
            <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <Label htmlFor="impact_statement" className="text-base font-medium">
                        Impact Statement
                    </Label>
                    <span className={`text-xs ${impactLength > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {impactLength}/{maxLength}
                    </span>
                </div>
                <Textarea
                    id="impact_statement"
                    placeholder="Describe the expected impact of this role on the organization. How does this position contribute to company success?"
                    value={data.impact_statement || ""}
                    onChange={(e) => updateData({ impact_statement: e.target.value })}
                    className="h-[150px] resize-none"
                />
                <p className="text-sm text-muted-foreground">
                    Example: "This role directly impacts revenue growth by ensuring product quality and timely delivery of features that meet customer needs."
                </p>
            </div>
        </div>
    );
}
