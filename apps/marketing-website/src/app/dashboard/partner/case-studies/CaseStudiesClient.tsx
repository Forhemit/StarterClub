"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type CaseStudy = {
    id: string;
    track: string;
    member_type: string | null;
    problem: string | null;
    outcome: string | null;
    partner_quote: string | null;
    timeline: string | null;
};

export default function CaseStudiesClient({ studies }: { studies: CaseStudy[] }) {
    if (studies.length === 0) {
        return (
            <EmptyState
                icon={Quote}
                title="No case studies yet"
                description="Check back soon for success stories from our partners."
            />
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {studies.map((study) => (
                <Card key={study.id} className="p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">{study.track}</Badge>
                        {study.member_type && <span className="text-sm text-muted-foreground">{study.member_type}</span>}
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <h4 className="font-semibold text-sm uppercase text-[var(--accent)] mb-1">The Challenge</h4>
                            <p className="text-sm text-gray-700">{study.problem || "N/A"}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm uppercase text-[var(--accent)] mb-1">The Outcome</h4>
                            <p className="text-sm text-gray-700">{study.outcome || "N/A"}</p>
                        </div>
                    </div>

                    {study.partner_quote && (
                        <div className="mt-6 pt-4 border-t bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                            <Quote className="h-4 w-4 text-gray-400 mb-2" />
                            <p className="italic text-sm text-gray-600">"{study.partner_quote}"</p>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
