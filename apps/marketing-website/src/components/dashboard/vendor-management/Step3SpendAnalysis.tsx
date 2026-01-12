"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { VendorManagementData, SpendRecord, SPEND_PERIODS, VENDOR_CATEGORIES } from "./types";

interface Step3Props {
    data: VendorManagementData;
    onUpdate: (data: Partial<VendorManagementData>) => void;
}

const EMPTY_SPEND: SpendRecord = {
    vendor_id: "",
    vendor_name: "",
    amount: 0,
    period: "monthly",
    period_date: "",
    category: "",
    notes: "",
};

export function Step3SpendAnalysis({ data, onUpdate }: Step3Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSpend, setEditingSpend] = useState<SpendRecord | null>(null);
    const [formData, setFormData] = useState<SpendRecord>(EMPTY_SPEND);

    const { spend_records = [], vendors = [] } = data;

    // Calculate spend summaries
    const spendByVendor = useMemo(() => {
        const summary: Record<string, { name: string; total: number; count: number }> = {};
        spend_records.forEach(record => {
            const vendorId = record.vendor_id || 'unknown';
            const vendorName = record.vendor_name || 'Unknown Vendor';
            if (!summary[vendorId]) {
                summary[vendorId] = { name: vendorName, total: 0, count: 0 };
            }
            summary[vendorId].total += record.amount || 0;
            summary[vendorId].count += 1;
        });
        return Object.entries(summary).sort((a, b) => b[1].total - a[1].total);
    }, [spend_records]);

    const spendByCategory = useMemo(() => {
        const summary: Record<string, number> = {};
        spend_records.forEach(record => {
            const category = record.category || 'Other';
            summary[category] = (summary[category] || 0) + (record.amount || 0);
        });
        return Object.entries(summary).sort((a, b) => b[1] - a[1]);
    }, [spend_records]);

    const totalSpend = useMemo(() => {
        return spend_records.reduce((sum, record) => sum + (record.amount || 0), 0);
    }, [spend_records]);

    const handleOpenNew = () => {
        setEditingSpend(null);
        setFormData({ ...EMPTY_SPEND, id: crypto.randomUUID() });
        setIsDialogOpen(true);
    };

    const handleEdit = (spend: SpendRecord) => {
        setEditingSpend(spend);
        setFormData({ ...spend });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const updatedSpend = spend_records.filter(s => s.id !== id);
        onUpdate({ spend_records: updatedSpend });
        toast.success("Spend record removed");
    };

    const handleSave = () => {
        if (!formData.amount || formData.amount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }

        // Get vendor name and category for display
        const selectedVendor = vendors.find(v => v.id === formData.vendor_id);
        const spendToSave = {
            ...formData,
            vendor_name: selectedVendor?.name || formData.vendor_name,
            category: formData.category || selectedVendor?.category || "Other",
        };

        let updatedSpend: SpendRecord[];
        if (editingSpend) {
            updatedSpend = spend_records.map(s => s.id === formData.id ? spendToSave : s);
            toast.success("Spend record updated");
        } else {
            updatedSpend = [...spend_records, spendToSave];
            toast.success("Spend record added");
        }

        onUpdate({ spend_records: updatedSpend });
        setIsDialogOpen(false);
        setFormData(EMPTY_SPEND);
        setEditingSpend(null);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const getPeriodLabel = (period: string) => {
        const labels: Record<string, string> = {
            'monthly': 'Monthly',
            'quarterly': 'Quarterly',
            'annual': 'Annual',
            'one-time': 'One-time',
        };
        return labels[period] || period;
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    Track and analyze your vendor spending patterns.
                </p>
                <Button onClick={handleOpenNew} className="gap-2" disabled={vendors.length === 0}>
                    <Plus className="w-4 h-4" />
                    Add Spend Record
                </Button>
            </div>

            {vendors.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center bg-muted/10">
                    <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">Add vendors first</p>
                    <p className="text-sm text-muted-foreground">
                        Go back to Step 1 to add vendors before tracking spend.
                    </p>
                </div>
            ) : (
                <>
                    {/* Spend Summary Cards */}
                    {spend_records.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 bg-card">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm font-medium">Total Spend</span>
                                </div>
                                <p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
                            </div>
                            <div className="border rounded-lg p-4 bg-card">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">Top Vendor</span>
                                </div>
                                <p className="text-lg font-semibold truncate">
                                    {spendByVendor[0]?.[1]?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {spendByVendor[0] ? formatCurrency(spendByVendor[0][1].total) : ''}
                                </p>
                            </div>
                            <div className="border rounded-lg p-4 bg-card">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm font-medium">Records</span>
                                </div>
                                <p className="text-2xl font-bold">{spend_records.length}</p>
                            </div>
                        </div>
                    )}

                    {/* Spend by Category */}
                    {spendByCategory.length > 0 && (
                        <div className="border rounded-lg p-4 bg-card">
                            <h3 className="font-medium mb-3">Spend by Category</h3>
                            <div className="space-y-2">
                                {spendByCategory.map(([category, amount]) => {
                                    const percentage = (amount / totalSpend) * 100;
                                    return (
                                        <div key={category} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{category}</span>
                                                <span className="font-medium">{formatCurrency(amount)}</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Spend Records List */}
                    {spend_records.length === 0 ? (
                        <div className="border border-dashed rounded-lg p-12 text-center bg-muted/10">
                            <DollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium text-foreground mb-1">No spend records yet</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start tracking your vendor spending.
                            </p>
                            <Button onClick={handleOpenNew} variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add First Spend Record
                            </Button>
                        </div>
                    ) : (
                        <div className="border rounded-lg divide-y bg-card">
                            <div className="p-3 bg-muted/30">
                                <h3 className="font-medium">Spend Records</h3>
                            </div>
                            {spend_records.map((record) => (
                                <div
                                    key={record.id}
                                    className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{formatCurrency(record.amount)}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                {getPeriodLabel(record.period)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {record.vendor_name || 'Unknown Vendor'}
                                            {record.category && ` • ${record.category}`}
                                            {record.period_date && ` • ${formatDate(record.period_date)}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(record)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(record.id!)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Spend Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingSpend ? "Edit Spend Record" : "Add Spend Record"}</DialogTitle>
                        <DialogDescription>
                            {editingSpend ? "Update spend details." : "Record a new vendor spend."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vendor-select">Vendor *</Label>
                                <Select
                                    value={formData.vendor_id}
                                    onValueChange={(value) => {
                                        const vendor = vendors.find(v => v.id === value);
                                        setFormData({
                                            ...formData,
                                            vendor_id: value,
                                            category: vendor?.category || formData.category,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.map((vendor) => (
                                            <SelectItem key={vendor.id} value={vendor.id!}>
                                                {vendor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount ($) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount || ""}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                    placeholder="1000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="period">Period</Label>
                                <Select
                                    value={formData.period}
                                    onValueChange={(value) => setFormData({ ...formData, period: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SPEND_PERIODS.map((period) => (
                                            <SelectItem key={period} value={period}>
                                                {getPeriodLabel(period)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="period-date">Period Date</Label>
                                <Input
                                    id="period-date"
                                    type="date"
                                    value={typeof formData.period_date === 'string' ? formData.period_date : ''}
                                    onChange={(e) => setFormData({ ...formData, period_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category || ""}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {VENDOR_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes..."
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {editingSpend ? "Update" : "Add"} Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
