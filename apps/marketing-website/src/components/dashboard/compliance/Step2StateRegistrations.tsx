"use client";

import { ComplianceData, ComplianceEvent } from "./types";
import { ComplianceEventList } from "./ComplianceEventList";

interface StepProps {
    data: ComplianceData;
    onUpdate: (updates: Partial<ComplianceData>) => void;
}

export function Step2StateRegistrations({ data, onUpdate }: StepProps) {
    const handleEventsChange = (events: ComplianceEvent[]) => {
        onUpdate({ registrations: events });
    };

    return (
        <div className="space-y-4">
            <ComplianceEventList
                events={data.registrations}
                onEventsChange={handleEventsChange}
                category="registration"
                title="State Registration"
                description="Manage Secretary of State annual reports and foreign qualifications."
            />
        </div>
    );
}
