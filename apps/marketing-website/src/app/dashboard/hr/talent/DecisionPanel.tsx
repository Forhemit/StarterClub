"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useState } from "react";

interface DecisionPanelProps {
    candidate: any;
    onHire: (id: string, details: any) => void;
    onWaitPool: (id: string, notes: string) => void;
}

export function DecisionPanel({ candidate, onHire, onWaitPool }: DecisionPanelProps) {
    const [notes, setNotes] = useState("");

    return (
        <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
                <CardTitle>Decision Required</CardTitle>
                <CardDescription>Make a hiring decision for {candidate.candidate_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Decision notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex gap-4">
                    <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onHire(candidate.id, { notes })}
                    >
                        ✅ Hire Candidate
                    </Button>
                    <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={() => onWaitPool(candidate.id, notes)}
                    >
                        ⏱️ Add to Wait Pool
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1"
                    >
                        ❌ Reject
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Inline OfferCodeGenerator for simplicity or separate if complex
export function OfferCodeGenerator({ candidateId }: { candidateId: string }) {
    const [code, setCode] = useState<string | null>(null);

    const generate = () => {
        setCode("OFFER-" + Math.random().toString(36).substr(2, 9).toUpperCase());
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Offer Management</CardTitle>
            </CardHeader>
            <CardContent>
                {!code ? (
                    <Button onClick={generate}>Generate Offer Link</Button>
                ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded border">
                        <code className="text-sm font-mono flex-1">https://company.hr/offer/{code}</code>
                        <Button size="icon" variant="ghost"><Copy className="h-4 w-4" /></Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
