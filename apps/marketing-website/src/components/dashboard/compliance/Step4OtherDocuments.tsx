"use client";

import { ComplianceData, ComplianceEvent } from "./types";
import { ComplianceEventList } from "./ComplianceEventList";

interface StepProps {
    data: ComplianceData;
    onUpdate: (updates: Partial<ComplianceData>) => void;
}

const DOCUMENT_PRESETS = [
    "Insurance Policy",
    "Lease Agreement",
    "Vendor Contract",
    "NDA Expiration",
    "Employee Handbook Review",
    "Board Resolution",
    "Shareholder Meeting",
    "Audit Report"
];

export function Step4OtherDocuments({ data, onUpdate }: StepProps) {
    const handleEventsChange = (events: ComplianceEvent[]) => {
        onUpdate({ other_documents: events });
    };

    return (
        <div className="space-y-4">
            <ComplianceEventList
                events={data.other_documents}
                onEventsChange={handleEventsChange}
                category="other"
                title="Other Documents"
                description="Track expiration dates for other critical business documents."
                titlePresets={DOCUMENT_PRESETS}
            />
        </div>
    );
}
