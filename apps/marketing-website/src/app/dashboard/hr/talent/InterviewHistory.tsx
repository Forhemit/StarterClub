"use client";

import { useState } from 'react';
import { DecisionPanel, OfferCodeGenerator } from './DecisionPanel';
import { WaitPoolManager } from './WaitPool';
import { useSupabaseHR } from '@/lib/hr/supabase/hrQueries';
import { Badge } from '@/components/ui/badge';

interface Interview {
    id: string;
    candidate_name: string;
    position: string;
    interview_date: string;
    interviewers: string[];
    score: number;
    feedback: string[];
    status: 'scheduled' | 'completed' | 'decision_pending' | 'hired' | 'rejected';
    tags: string[];
}

const CandidateDetail = ({ candidate }: { candidate: Interview }) => (
    <div className="bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold mb-2">{candidate.candidate_name}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{candidate.position}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{candidate.status}</Badge>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-medium text-lg">{candidate.score}/100</p>
            </div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Feedback Summary</h4>
            <ul className="list-disc list-inside">
                {candidate.feedback?.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
        </div>
    </div>
);

export default function InterviewHistory() {
    const [selectedCandidate, setSelectedCandidate] = useState<Interview | null>(null);
    const [view, setView] = useState<'list' | 'detail' | 'decision'>('list');
    const { data: interviews, isLoading } = useSupabaseHR('interview_history');

    const handleHireDecision = async (candidateId: string, offerDetails: any) => {
        console.log("Hiring", candidateId, offerDetails);
        // Logic placeholder
    };

    const handleWaitPool = async (candidateId: string, notes: string) => {
        console.log("Waitpool", candidateId, notes);
        // Logic placeholder
    };

    if (isLoading) return <div>Loading candidates...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Interview History</h2>
                    <p className="text-muted-foreground">Track, evaluate, and decide on candidates</p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-green-600 hover:bg-green-700">Hired: 12</Badge>
                    <Badge variant="secondary" className="bg-orange-500 text-white">Pending: 8</Badge>
                    <Badge variant="outline">Wait Pool: 24</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Interview List */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
                        <div className="p-4 border-b">
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="w-full p-2 rounded-lg border bg-background"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Candidate</th>
                                        <th className="p-3 text-left font-medium">Position</th>
                                        <th className="p-3 text-left font-medium">Score</th>
                                        <th className="p-3 text-left font-medium">Status</th>
                                        <th className="p-3 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(interviews as Interview[])?.map((interview) => (
                                        <tr
                                            key={interview.id}
                                            className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setSelectedCandidate(interview);
                                                setView('detail');
                                            }}
                                        >
                                            <td className="p-3">
                                                <div className="font-medium">{interview.candidate_name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(interview.interview_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">{interview.position}</td>
                                            <td className="p-3">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-muted rounded-full h-2 mr-2 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-green-500"
                                                            style={{ width: `${interview.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs">{interview.score}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant={
                                                    interview.status === 'hired' ? 'default' : // default is roughly primary/dark
                                                        interview.status === 'rejected' ? 'destructive' :
                                                            'secondary'
                                                }>
                                                    {interview.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCandidate(interview);
                                                        setView('decision');
                                                    }}
                                                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                                                >
                                                    Decide
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Decision Panel or Candidate Detail */}
                <div className="space-y-6">
                    {view === 'detail' && selectedCandidate && (
                        <CandidateDetail candidate={selectedCandidate} />
                    )}

                    {view === 'decision' && selectedCandidate && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <DecisionPanel
                                candidate={selectedCandidate}
                                onHire={handleHireDecision}
                                onWaitPool={handleWaitPool}
                            />
                            <OfferCodeGenerator candidateId={selectedCandidate.id} />
                            <WaitPoolManager candidateId={selectedCandidate.id} />
                        </div>
                    )}

                    {!selectedCandidate && (
                        <div className="h-full flex items-center justify-center p-8 text-muted-foreground border rounded-xl border-dashed">
                            Select a candidate to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
