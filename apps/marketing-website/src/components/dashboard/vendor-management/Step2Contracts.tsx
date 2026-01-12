"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, FileText, Calendar, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { VendorManagementData, Contract } from "./types";

interface Step2Props {
    data: VendorManagementData;
    onUpdate: (data: Partial<VendorManagementData>) => void;
}

const EMPTY_CONTRACT: Contract = {
    vendor_id: "",
    vendor_name: "",
    contract_name: "",
    start_date: "",
    end_date: "",
    value: undefined,
    renewal_alert_days: 30,
    auto_renew: false,
    notes: "",
};

export function Step2Contracts({ data, onUpdate }: Step2Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [formData, setFormData] = useState<Contract>(EMPTY_CONTRACT);

    const { contracts = [], vendors = [] } = data;

    const handleOpenNew = () => {
        setEditingContract(null);
        setFormData({ ...EMPTY_CONTRACT, id: crypto.randomUUID() });
        setIsDialogOpen(true);
    };

    const handleEdit = (contract: Contract) => {
        setEditingContract(contract);
        setFormData({ ...contract });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const updatedContracts = contracts.filter(c => c.id !== id);
        onUpdate({ contracts: updatedContracts });
        toast.success("Contract removed");
    };

    const handleSave = () => {
        if (!formData.contract_name.trim()) {
            toast.error("Contract name is required");
            return;
        }

        // Get vendor name for display
        const selectedVendor = vendors.find(v => v.id === formData.vendor_id);
        const contractToSave = {
            ...formData,
            vendor_name: selectedVendor?.name || formData.vendor_name,
        };

        let updatedContracts: Contract[];
        if (editingContract) {
            updatedContracts = contracts.map(c => c.id === formData.id ? contractToSave : c);
            toast.success("Contract updated");
        } else {
            updatedContracts = [...contracts, contractToSave];
            toast.success("Contract added");
        }

        onUpdate({ contracts: updatedContracts });
        setIsDialogOpen(false);
        setFormData(EMPTY_CONTRACT);
        setEditingContract(null);
    };

    const getDaysUntilExpiry = (endDate: string | Date | undefined): number | null => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getExpiryStatus = (contract: Contract) => {
        const daysLeft = getDaysUntilExpiry(contract.end_date);
        if (daysLeft === null) return null;

        if (daysLeft < 0) {
            return { label: "Expired", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
        } else if (daysLeft <= (contract.renewal_alert_days || 30)) {
            return { label: `${daysLeft} days left`, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
        }
        return { label: `${daysLeft} days`, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
    };

    const formatCurrency = (value: number | undefined) => {
        if (!value) return "";
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
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    Track contract terms, renewal dates, and values.
                </p>
                <Button onClick={handleOpenNew} className="gap-2" disabled={vendors.length === 0}>
                    <Plus className="w-4 h-4" />
                    Add Contract
                </Button>
            </div>

            {vendors.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center bg-muted/10">
                    <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">Add vendors first</p>
                    <p className="text-sm text-muted-foreground">
                        Go back to Step 1 to add vendors before creating contracts.
                    </p>
                </div>
            ) : contracts.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center bg-muted/10">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">No contracts yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Track your vendor contracts and never miss a renewal.
                    </p>
                    <Button onClick={handleOpenNew} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Your First Contract
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {contracts.map((contract) => {
                        const expiryStatus = getExpiryStatus(contract);
                        return (
                            <div
                                key={contract.id}
                                className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-lg">{contract.contract_name}</h3>
                                            {contract.auto_renew && (
                                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <RefreshCw className="w-3 h-3" />
                                                    Auto-renew
                                                </span>
                                            )}
                                            {expiryStatus && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expiryStatus.color}`}>
                                                    {expiryStatus.label}
                                                </span>
                                            )}
                                        </div>
                                        {contract.vendor_name && (
                                            <p className="text-sm text-muted-foreground">
                                                Vendor: {contract.vendor_name}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                            {contract.value && (
                                                <span className="font-medium text-foreground">
                                                    {formatCurrency(contract.value)}
                                                </span>
                                            )}
                                            {contract.start_date && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(contract)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(contract.id!)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {contract.notes && (
                                    <p className="text-sm text-muted-foreground mt-3 pt-3 border-t italic">
                                        {contract.notes}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Contract Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingContract ? "Edit Contract" : "Add Contract"}</DialogTitle>
                        <DialogDescription>
                            {editingContract ? "Update contract details." : "Add a new contract to track."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contract-name">Contract Name *</Label>
                                <Input
                                    id="contract-name"
                                    value={formData.contract_name}
                                    onChange={(e) => setFormData({ ...formData, contract_name: e.target.value })}
                                    placeholder="e.g. Annual SaaS License"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vendor-select">Vendor</Label>
                                <Select
                                    value={formData.vendor_id}
                                    onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Start Date</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={typeof formData.start_date === 'string' ? formData.start_date : ''}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date">End Date</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={typeof formData.end_date === 'string' ? formData.end_date : ''}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="value">Contract Value ($)</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={formData.value || ""}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : undefined })}
                                    placeholder="10000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="renewal-alert">Renewal Alert (days before)</Label>
                                <Input
                                    id="renewal-alert"
                                    type="number"
                                    value={formData.renewal_alert_days || 30}
                                    onChange={(e) => setFormData({ ...formData, renewal_alert_days: parseInt(e.target.value) || 30 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="auto-renew"
                                checked={formData.auto_renew}
                                onCheckedChange={(checked) => setFormData({ ...formData, auto_renew: checked })}
                            />
                            <Label htmlFor="auto-renew">Auto-renew contract</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes about this contract..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {editingContract ? "Update" : "Add"} Contract
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
