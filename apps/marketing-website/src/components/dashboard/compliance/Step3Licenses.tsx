"use client";

import { ComplianceData, ComplianceEvent } from "./types";
import { ComplianceEventList } from "./ComplianceEventList";

interface StepProps {
    data: ComplianceData;
    onUpdate: (updates: Partial<ComplianceData>) => void;
}

export function Step3Licenses({ data, onUpdate }: StepProps) {
    const handleEventsChange = (events: ComplianceEvent[]) => {
        onUpdate({ licenses: events });
    };

    return (
        <div className="space-y-4">
            <ComplianceEventList
                events={data.licenses}
                onEventsChange={handleEventsChange}
                category="license"
                title="Business License"
                description="Keep track of professional licenses, operational permits, and certifications."
                showJurisdiction={true}
            />
        </div>
    );
}
