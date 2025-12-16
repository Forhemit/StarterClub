"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { Trash, Plus } from "lucide-react";
import { createCaseStudyAction, deleteCaseStudyAction } from "../actions";

export default function CaseStudiesAdminClient({ initialStudies }: { initialStudies: any[] }) {
    const [studies, setStudies] = useState(initialStudies);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form State
    const [partnerName, setPartnerName] = useState("");
    const [problem, setProblem] = useState("");
    const [outcome, setOutcome] = useState("");
    const [quote, setQuote] = useState("");

    const handleCreate = async () => {
        setLoading(true);
        try {
            const { success, data, error } = await createCaseStudyAction({
                partner_name: partnerName,
                problem_statement: problem,
                outcome_stats: outcome,
                partner_quote: quote,
                is_published: true
            });
            if (!success) throw new Error(error);
            setStudies(prev => [data, ...prev]);
            toast.success("Case Study created!");
            setPartnerName(""); setProblem(""); setOutcome(""); setQuote("");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        try {
            const { success, error } = await deleteCaseStudyAction(id);
            if (!success) throw new Error(error);
            setStudies(prev => prev.filter(s => s.id !== id));
            toast.success("Deleted!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Add New Case Study</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Partner Name</Label>
                        <Input value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Outcome Stats (e.g. +40% ROI)</Label>
                        <Input value={outcome} onChange={e => setOutcome(e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Problem Statement</Label>
                        <Input value={problem} onChange={e => setProblem(e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Quote</Label>
                        <Input value={quote} onChange={e => setQuote(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <Button onClick={handleCreate} disabled={loading || !partnerName} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Publish Case Study
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4">
                {studies.map(s => (
                    <div key={s.id} className="p-4 border rounded bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold">{s.partner_name}</h4>
                                <p className="text-sm text-gray-500 italic">"{s.partner_quote}"</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)} disabled={loading}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2 text-sm grid grid-cols-2 gap-2 text-gray-600">
                            <div><strong>Problem:</strong> {s.problem_statement}</div>
                            <div><strong>Outcome:</strong> {s.outcome_stats}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
