"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

import { format } from "date-fns";
import { updateWaitlistStatus, updateInquiryStatus } from "./actions";
import { useToast } from "@/context/ToastContext";
import { Loader2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types matching DB
type WaitlistSubmission = {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    project_idea?: string;
    source: string;
    status: string;
    created_at: string;
};

type PartnerInquiry = {
    id: string;
    full_name: string;
    email: string;
    organization: string;
    message: string;
    status: string;
    created_at: string;
};

export default function SubmissionsClient({
    waitlist,
    inquiries
}: {
    waitlist: WaitlistSubmission[];
    inquiries: PartnerInquiry[];
}) {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Sort by newest first
    const sortedWaitlist = [...waitlist].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const sortedInquiries = [...inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const handleWaitlistStatus = async (id: string, newStatus: string) => {
        setLoadingId(id);
        try {
            const res = await updateWaitlistStatus(id, newStatus);
            if (!res.success) throw new Error(res.error);
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleInquiryStatus = async (id: string, newStatus: string) => {
        setLoadingId(id);
        try {
            const res = await updateInquiryStatus(id, newStatus);
            if (!res.success) throw new Error(res.error);
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const StatusSelect = ({ current, onChange, options, id }: { current: string, onChange: (val: string) => void, options: string[], id: string }) => (
        <select
            className="text-xs border rounded p-1 bg-white disabled:opacity-50"
            value={current}
            onChange={(e) => onChange(e.target.value)}
            disabled={loadingId === id}
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
        </select>
    );

    return (
        <div className="space-y-6">
            <Tabs defaultValue="waitlist" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="waitlist" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Waitlist ({waitlist.length})
                    </TabsTrigger>
                    <TabsTrigger value="inquiries" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Inquiries ({inquiries.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="waitlist">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4">Waitlist Submissions</h3>
                        <div className="space-y-4">
                            {sortedWaitlist.length === 0 ? (
                                <EmptyState
                                    icon={MessageSquare}
                                    title="No waitlist submissions"
                                    description="Waitlist signups will appear here."
                                />
                            ) : (
                                sortedWaitlist.map(sub => (
                                    <div key={sub.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between bg-white shadow-sm">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{sub.full_name}</span>
                                                <span className="text-xs text-gray-500">&bull; {sub.email}</span>
                                                {sub.phone && <span className="text-xs text-gray-500">&bull; {sub.phone}</span>}
                                            </div>
                                            {sub.project_idea && (
                                                <p className="text-sm bg-gray-50 p-2 rounded mt-1 border border-gray-100">
                                                    &quot;{sub.project_idea}&quot;
                                                </p>
                                            )}
                                            <div className="flex gap-2 text-xs text-gray-400 mt-2">
                                                <span>{format(new Date(sub.created_at), 'PPP p')}</span>
                                                <span>&bull; Source: {sub.source}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[140px] items-end justify-start">
                                            <StatusSelect
                                                id={sub.id}
                                                current={sub.status}
                                                onChange={(val) => handleWaitlistStatus(sub.id, val)}
                                                options={['pending', 'approved', 'waitlisted', 'contacted', 'archived']}
                                            />
                                            {loadingId === sub.id && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="inquiries">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4">Partner Inquiries</h3>
                        <div className="space-y-4">
                            {sortedInquiries.length === 0 ? (
                                <EmptyState
                                    icon={Mail}
                                    title="No inquiries found"
                                    description="Partner inquiries will appear here."
                                />
                            ) : (
                                sortedInquiries.map(inq => (
                                    <div key={inq.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between bg-white shadow-sm">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{inq.full_name}</span>
                                                <span className="text-xs text-gray-500">&bull; {inq.email}</span>
                                            </div>
                                            <div className="text-xs font-semibold text-[var(--accent)]">
                                                Org: {inq.organization}
                                            </div>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1 border border-gray-100 whitespace-pre-wrap">
                                                {inq.message}
                                            </p>
                                            <div className="flex gap-2 text-xs text-gray-400 mt-2">
                                                <span>{format(new Date(inq.created_at), 'PPP p')}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[140px] items-end justify-start">
                                            <StatusSelect
                                                id={inq.id}
                                                current={inq.status}
                                                onChange={(val) => handleInquiryStatus(inq.id, val)}
                                                options={['new', 'viewed', 'contacted', 'converted', 'rejected']}
                                            />
                                            {loadingId === inq.id && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
