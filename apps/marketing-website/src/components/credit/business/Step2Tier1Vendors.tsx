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
    Pencil,
    Trash2,
    Package,
    Loader2,
    CheckCircle2,
    Clock,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import type { BusinessCreditData, Tradeline, TierLevel, AccountType } from "../types";
import { saveTradeline, deleteTradeline } from "@/actions/credit-actions";
import { BUSINESS_TIERS } from "../types";

interface Step2Props {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
    tradelines?: Tradeline[];
    onRefreshTradelines?: () => Promise<void>;
}

const POPULAR_TIER1_VENDORS = [
    { name: "Uline", website: "uline.com", minOrder: "$50" },
    { name: "Grainger", website: "grainger.com", minOrder: "$100" },
    { name: "Quill", website: "quill.com", minOrder: "$50" },
    { name: "Strategic Network Solutions", website: "snscard.com", minOrder: "$59" },
    { name: "Crown Office Supplies", website: "crownofficesupplies.com", minOrder: "$99" },
    { name: "The CEO Creative", website: "theceocreative.com", minOrder: "$149" },
];

const PAYMENT_TERMS: { value: AccountType; label: string }[] = [
    { value: "net-30", label: "Net-30" },
    { value: "net-60", label: "Net-60" },
    { value: "net-90", label: "Net-90" },
];

export function Step2Tier1Vendors({ data, onSave, tradelines = [], onRefreshTradelines }: Step2Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Filter for Tier 1 accounts only
    const tier1Accounts = tradelines.filter(t => t.tierLevel === 1);

    // Count reporting accounts
    const reportingCount = tier1Accounts.filter(t =>
        t.reportsToDnb || t.reportsToExperian
    ).length;

    // Form state
    const [formData, setFormData] = useState<Partial<Tradeline>>({
        accountType: "net-30",
        accountStatus: "open",
        isBusinessCredit: true,
        tierLevel: 1,
    });

    const resetForm = () => {
        setFormData({
            accountType: "net-30",
            accountStatus: "open",
            isBusinessCredit: true,
            tierLevel: 1,
        });
        setEditingTradeline(null);
    };

    const handleOpenDialog = (tradeline?: Tradeline) => {
        if (tradeline) {
            setEditingTradeline(tradeline);
            setFormData(tradeline);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSelectVendor = (vendorName: string) => {
        setFormData(prev => ({ ...prev, creditorName: vendorName }));
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.creditorName) {
            toast.error("Vendor name is required");
            return;
        }

        setIsSaving(true);
        try {
            const result = await saveTradeline({
                ...formData,
                id: editingTradeline?.id,
                businessProfileId: data.id,
            });

            if (result.success) {
                toast.success(editingTradeline ? "Vendor updated" : "Vendor added");
                setIsDialogOpen(false);
                resetForm();
                onRefreshTradelines?.();

                // Update tier completion status
                if (reportingCount >= 2) {
                    onSave({ tier1Complete: true, currentTier: Math.max(data.currentTier || 0, 1) as TierLevel });
                }
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch {
            toast.error("Failed to save vendor");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteTradeline(id);
            if (result.success) {
                toast.success("Vendor deleted");
                onRefreshTradelines?.();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete vendor");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tier Info */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                            {BUSINESS_TIERS[1].name}
                        </h4>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                            {BUSINESS_TIERS[1].description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                            Requirement: {BUSINESS_TIERS[1].requirement}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div>
                    <h3 className="font-semibold">{tier1Accounts.length} Vendor{tier1Accounts.length !== 1 ? 's' : ''} Added</h3>
                    <p className="text-sm text-muted-foreground">
                        {reportingCount} reporting to bureaus ({reportingCount >= 3 ? "✅ Ready for Tier 2" : `Need ${3 - reportingCount} more`})
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vendor
                </Button>
            </div>

            {/* Popular Vendors */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Popular Tier 1 Vendors</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    These vendors report to D&amp;B/Experian without a personal credit check.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POPULAR_TIER1_VENDORS.map((vendor) => {
                        const isAdded = tier1Accounts.some(t =>
                            t.creditorName.toLowerCase().includes(vendor.name.toLowerCase())
                        );

                        return (
                            <div
                                key={vendor.name}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAdded
                                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                    : "bg-card hover:bg-muted/50"
                                    }`}
                            >
                                <div>
                                    <h4 className="font-medium flex items-center gap-2">
                                        {vendor.name}
                                        {isAdded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Min: {vendor.minOrder}
                                    </p>
                                </div>
                                {!isAdded && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSelectVendor(vendor.name)}
                                    >
                                        Add
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Existing Accounts */}
            {tier1Accounts.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Your Tier 1 Accounts</Label>

                    <div className="grid gap-3">
                        {tier1Accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between p-4 rounded-xl border bg-card"
                            >
                                <div className="flex items-center gap-4">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium">{account.creditorName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {account.accountType}
                                            </Badge>
                                            {account.reportsToDnb && (
                                                <Badge variant="secondary" className="text-xs">D&amp;B</Badge>
                                            )}
                                            {account.reportsToExperian && (
                                                <Badge variant="secondary" className="text-xs">Experian</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(account)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsDeleting(account.id!)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingTradeline ? "Edit Vendor" : "Add Tier 1 Vendor"}</DialogTitle>
                        <DialogDescription>
                            Track a Net-30 vendor account
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="vendorName">Vendor Name</Label>
                            <Input
                                id="vendorName"
                                placeholder="e.g., Uline, Grainger"
                                value={formData.creditorName || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Terms</Label>
                            <Select
                                value={formData.accountType || "net-30"}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, accountType: v as AccountType }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_TERMS.map(term => (
                                        <SelectItem key={term.value} value={term.value}>
                                            {term.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="creditLimit">Credit Limit</Label>
                            <Input
                                id="creditLimit"
                                type="number"
                                min={0}
                                placeholder="500"
                                value={formData.creditLimit || ""}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    creditLimit: e.target.value ? parseFloat(e.target.value) : undefined
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOpened">Date Opened</Label>
                            <Input
                                id="dateOpened"
                                type="date"
                                value={formData.dateOpened || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, dateOpened: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <Label className="text-sm font-medium">Reports To</Label>

                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                <span className="text-sm">Dun &amp; Bradstreet (D&amp;B)</span>
                                <Switch
                                    checked={formData.reportsToDnb || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reportsToDnb: checked }))}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                                <span className="text-sm">Experian Business</span>
                                <Switch
                                    checked={formData.reportsToExperian || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reportsToExperian: checked }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingTradeline ? "Update" : "Add Vendor"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vendor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove this vendor from your Tier 1 tracking.
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
