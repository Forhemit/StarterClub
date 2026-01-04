"use client";

import { ComplianceData, ComplianceEvent } from "./types";
import { ComplianceEventList } from "./ComplianceEventList";

interface StepProps {
    data: ComplianceData;
    onUpdate: (updates: Partial<ComplianceData>) => void;
}

export function Step1TaxFilings({ data, onUpdate }: StepProps) {
    const handleEventsChange = (events: ComplianceEvent[]) => {
        onUpdate({ tax_events: events });
    };

    return (
        <div className="space-y-4">
            <ComplianceEventList
                events={data.tax_events}
                onEventsChange={handleEventsChange}
                category="tax"
                title="Tax Filing"
                description="Track federal, state, and local tax filing deadlines."
            />
        </div>
    );
}
