"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Trash2, CheckCircle2, Clock, AlertTriangle, Calendar, Download } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComplianceEntry {
    id: string;
    userName: string;
    title?: string;
    userEmail: string;
    completionStatus: 'pending' | 'complete';
    completedAt: string | null;
    expiryDate: string | null;
}

const TITLES = [
    "CFO", "CEO", "COO", "CTO", "CMO", "CRO", "CPO",
    "General Counsel", "VP Finance", "VP HR", "VP Sales", "VP Engineering",
    "Director", "Manager", "Associate", "Other"
];

interface Step11Props {
    data: any;
    onSave: (data: any) => void;
}

export function Step11ComplianceLog({ data, onSave }: Step11Props) {
    const [complianceLog, setComplianceLog] = useState<ComplianceEntry[]>(data.complianceLog || []);

    useEffect(() => {
        onSave({ ...data, complianceLog });
    }, [complianceLog]);

    const addEntry = () => {
        setComplianceLog([...complianceLog, {
            id: crypto.randomUUID(),
            userName: "",
            title: "",
            userEmail: "",
            completionStatus: "pending",
            completedAt: null,
            expiryDate: null,
        }]);
    };

    const updateEntry = (id: string, updates: Partial<ComplianceEntry>) => {
        setComplianceLog(complianceLog.map(entry => {
            if (entry.id !== id) return entry;

            const updated = { ...entry, ...updates };

            // Auto-calculate expiry date when marked complete
            if (updates.completionStatus === 'complete' && !updated.completedAt) {
                const now = new Date();
                updated.completedAt = now.toISOString().split('T')[0];
                const expiry = new Date(now);
                expiry.setFullYear(expiry.getFullYear() + 1);
                updated.expiryDate = expiry.toISOString().split('T')[0];
            }

            return updated;
        }));
    };

    const removeEntry = (id: string) => {
        setComplianceLog(complianceLog.filter(entry => entry.id !== id));
    };

    const isExpiringSoon = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const getStatusBadge = (entry: ComplianceEntry) => {
        if (entry.completionStatus === 'pending') {
            return <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
        if (isExpired(entry.expiryDate)) {
            return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Expired</Badge>;
        }
        if (isExpiringSoon(entry.expiryDate)) {
            return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" /> Due Soon</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</Badge>;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "---";
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const pendingCount = complianceLog.filter(e => e.completionStatus === 'pending').length;
    const dueSoonCount = complianceLog.filter(e => isExpiringSoon(e.expiryDate)).length;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    Compliance & Training Log
                </h3>
                <p className="text-sm text-muted-foreground">
                    Track completion status of leadership succession planning by team members.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{complianceLog.length}</div>
                    <div className="text-xs text-muted-foreground uppercase">Total Entries</div>
                </Card>
                <Card className={`p-4 text-center ${pendingCount > 0 ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                    <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
                    <div className="text-xs text-muted-foreground uppercase">Pending</div>
                </Card>
                <Card className={`p-4 text-center ${dueSoonCount > 0 ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                    <div className="text-2xl font-bold text-red-700">{dueSoonCount}</div>
                    <div className="text-xs text-muted-foreground uppercase">Due Soon</div>
                </Card>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Compliance Entries</Label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={addEntry}>
                        <Plus className="w-4 h-4 mr-2" /> Add User
                    </Button>
                </div>
            </div>

            {/* Table */}
            {complianceLog.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">User</TableHead>
                                <TableHead className="w-[20%]">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Completed</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {complianceLog.map((entry) => (
                                <TableRow key={entry.id} className={
                                    entry.completionStatus === 'pending' ? 'bg-amber-50/30 dark:bg-amber-900/5' :
                                        isExpiringSoon(entry.expiryDate) ? 'bg-red-50/30 dark:bg-red-900/5' : ''
                                }>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Name"
                                                value={entry.userName}
                                                onChange={(e) => updateEntry(entry.id, { userName: e.target.value })}
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                placeholder="Email"
                                                value={entry.userEmail}
                                                onChange={(e) => updateEntry(entry.id, { userEmail: e.target.value })}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={entry.title || ""}
                                            onValueChange={(v) => updateEntry(entry.id, { title: v })}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Select Title" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TITLES.map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={entry.completionStatus}
                                            onValueChange={(v) => updateEntry(entry.id, { completionStatus: v as ComplianceEntry['completionStatus'] })}
                                        >
                                            <SelectTrigger className="w-[130px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="complete">Complete</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="mt-2">
                                            {getStatusBadge(entry)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {entry.completionStatus === 'complete' ? (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(entry.completedAt)}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">---</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {entry.expiryDate ? (
                                            <div className={`flex items-center gap-1 ${isExpiringSoon(entry.expiryDate) || isExpired(entry.expiryDate) ? 'text-red-700 font-medium' : 'text-muted-foreground'
                                                }`}>
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(entry.expiryDate)}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">---</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No compliance entries yet</p>
                        <p className="text-sm mt-1">Add team members to track their succession planning completion.</p>
                    </CardContent>
                </Card>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Automatic Renewal</h4>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                    Expiry dates are automatically set to 1 year after completion. Items due within 30 days are highlighted for review.
                </p>
            </div>
        </div>
    );
}
