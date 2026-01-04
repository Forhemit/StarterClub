"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Plus,
    Search,
    Trash2,
    Loader2,
    Clock,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import type { PersonalCreditData, Inquiry, Bureau } from "../types";
import { saveInquiry, deleteInquiry } from "@/actions/credit-actions";

interface Step4Props {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
    inquiries?: Inquiry[];
    onRefreshInquiries?: () => Promise<void>;
}

const BUREAUS: { value: Bureau; label: string }[] = [
    { value: "experian", label: "Experian" },
    { value: "transunion", label: "TransUnion" },
    { value: "equifax", label: "Equifax" },
];

function InquiryCard({
    inquiry,
    onDelete
}: {
    inquiry: Inquiry;
    onDelete: () => void;
}) {
    // Calculate days until impact ends
    const impactEnds = inquiry.impactEndsDate ? new Date(inquiry.impactEndsDate) : null;
    const visibilityEnds = inquiry.visibilityEndsDate ? new Date(inquiry.visibilityEndsDate) : null;
    const now = new Date();

    const daysUntilImpactEnds = impactEnds
        ? Math.ceil((impactEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const impactExpired = daysUntilImpactEnds !== null && daysUntilImpactEnds <= 0;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${inquiry.isHardPull
            ? impactExpired
                ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
            : "bg-card/50 hover:bg-card/80"
            }`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${inquiry.isHardPull
                    ? impactExpired
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-muted"
                    }`}>
                    {inquiry.isHardPull
                        ? impactExpired
                            ? <CheckCircle className="w-5 h-5 text-green-600" />
                            : <AlertCircle className="w-5 h-5 text-amber-600" />
                        : <Search className="w-5 h-5 text-muted-foreground" />
                    }
                </div>
                <div>
                    <h4 className="font-medium">{inquiry.creditorName}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={inquiry.isHardPull ? "destructive" : "secondary"} className="text-xs">
                            {inquiry.isHardPull ? "Hard Pull" : "Soft Pull"}
                        </Badge>
                        {inquiry.bureau && (
                            <Badge variant="outline" className="text-xs capitalize">
                                {inquiry.bureau}
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {formatDate(inquiry.inquiryDate)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {inquiry.isHardPull && daysUntilImpactEnds !== null && (
                    <div className="text-right">
                        {impactExpired ? (
                            <p className="text-xs text-green-600 font-medium">Impact Expired</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {daysUntilImpactEnds} days
                                </p>
                                <p className="text-xs text-muted-foreground">until no score impact</p>
                            </>
                        )}
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export function Step4InquiryTracker({ data, onSave, inquiries = [], onRefreshInquiries }: Step4Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filterType, setFilterType] = useState<"all" | "hard" | "soft">("all");

    // Form state
    const [formData, setFormData] = useState<Partial<Inquiry>>({
        isHardPull: true,
        inquiryDate: new Date().toISOString().split('T')[0],
    });

    const resetForm = () => {
        setFormData({
            isHardPull: true,
            inquiryDate: new Date().toISOString().split('T')[0],
        });
    };

    const handleSave = async () => {
        if (!formData.creditorName) {
            toast.error("Creditor name is required");
            return;
        }
        if (!formData.inquiryDate) {
            toast.error("Inquiry date is required");
            return;
        }

        if (!data.id) {
            toast.error("Please wait for profile specific data to save...");
            return;
        }

        setIsSaving(true);
        try {
            const result = await saveInquiry({
                ...formData,
                personalProfileId: data.id,
            });

            if (result.success) {
                toast.success("Inquiry added");
                setIsDialogOpen(false);
                resetForm();
                onRefreshInquiries?.();
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch {
            toast.error("Failed to save inquiry");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteInquiry(id);
            if (result.success) {
                toast.success("Inquiry deleted");
                onRefreshInquiries?.();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete inquiry");
        } finally {
            setIsDeleting(null);
        }
    };

    // Filter and sort inquiries
    const filteredInquiries = inquiries
        .filter(i => {
            if (filterType === "hard") return i.isHardPull;
            if (filterType === "soft") return !i.isHardPull;
            return true;
        })
        .sort((a, b) => new Date(b.inquiryDate).getTime() - new Date(a.inquiryDate).getTime());

    // Count stats
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const hardPullsLast12 = inquiries.filter(i =>
        i.isHardPull && new Date(i.inquiryDate) >= oneYearAgo
    ).length;

    const expiredInquiries = inquiries.filter(i => {
        if (!i.isHardPull || !i.impactEndsDate) return false;
        return new Date(i.impactEndsDate) <= now;
    }).length;

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 border text-center">
                    <p className="text-2xl font-bold">{inquiries.length}</p>
                    <p className="text-xs text-muted-foreground">Total Inquiries</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                    <p className="text-2xl font-bold text-amber-600">{hardPullsLast12}</p>
                    <p className="text-xs text-muted-foreground">Hard Pulls (12mo)</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center">
                    <p className="text-2xl font-bold text-green-600">{expiredInquiries}</p>
                    <p className="text-xs text-muted-foreground">Impact Expired</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                        {inquiries.filter(i => !i.isHardPull).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Soft Pulls</p>
                </div>
            </div>

            {/* Filter & Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | "hard" | "soft")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Inquiries</SelectItem>
                        <SelectItem value="hard">Hard Pulls Only</SelectItem>
                        <SelectItem value="soft">Soft Pulls Only</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Inquiry
                </Button>
            </div>

            {/* Inquiry List */}
            <div className="space-y-3">
                {filteredInquiries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inquiries tracked</p>
                        <p className="text-sm">Add your credit inquiries to track their impact on your score</p>
                    </div>
                ) : (
                    filteredInquiries.map((inquiry) => (
                        <InquiryCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            onDelete={() => setIsDeleting(inquiry.id!)}
                        />
                    ))
                )}
            </div>

            {/* Info Card */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 How Inquiries Affect Your Score</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>• <strong>Hard pulls</strong> affect your score for 12 months, visible for 24 months</li>
                    <li>• <strong>Soft pulls</strong> don't affect your score (you checking, pre-approvals)</li>
                    <li>• Multiple inquiries for same loan type within 14-45 days count as one</li>
                    <li>• Keep hard inquiries under 3-5 per year for best results</li>
                </ul>
            </div>

            {/* Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Add Credit Inquiry</DialogTitle>
                        <DialogDescription>
                            Track a new inquiry on your credit report
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Creditor Name */}
                        <div className="space-y-2">
                            <Label htmlFor="creditor">Creditor Name</Label>
                            <Input
                                id="creditor"
                                placeholder="e.g., Chase Bank, Discover"
                                value={formData.creditorName || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
                            />
                        </div>

                        {/* Inquiry Type */}
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                            <div>
                                <Label htmlFor="hardPull" className="text-sm font-medium">Hard Pull</Label>
                                <p className="text-xs text-muted-foreground">Affects your credit score</p>
                            </div>
                            <Switch
                                id="hardPull"
                                checked={formData.isHardPull ?? true}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHardPull: checked }))}
                            />
                        </div>

                        {/* Bureau */}
                        <div className="space-y-2">
                            <Label>Bureau</Label>
                            <Select
                                value={formData.bureau || ""}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, bureau: v as Bureau }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bureau" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BUREAUS.map(bureau => (
                                        <SelectItem key={bureau.value} value={bureau.value}>
                                            {bureau.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Inquiry Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.inquiryDate || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, inquiryDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Inquiry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Inquiry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove this inquiry from your tracking. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => isDeleting && handleDelete(isDeleting)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
