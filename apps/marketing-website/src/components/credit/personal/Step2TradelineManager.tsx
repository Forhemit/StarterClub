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
    DialogTrigger,
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
    CreditCard,
    Building2,
    Car,
    Home,
    GraduationCap,
    Loader2,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import type { PersonalCreditData, Tradeline, AccountType, AccountStatus } from "../types";
import { saveTradeline, deleteTradeline } from "@/actions/credit-actions";
import { calculateUtilization, getUtilizationBand } from "../types";

interface Step2Props {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
    tradelines?: Tradeline[];
    onRefreshTradelines?: () => Promise<void>;
}

const ACCOUNT_TYPES: { value: AccountType; label: string; icon: React.ElementType }[] = [
    { value: "revolving", label: "Credit Card", icon: CreditCard },
    { value: "installment", label: "Installment Loan", icon: Building2 },
    { value: "auto", label: "Auto Loan", icon: Car },
    { value: "mortgage", label: "Mortgage", icon: Home },
    { value: "student", label: "Student Loan", icon: GraduationCap },
    { value: "heloc", label: "HELOC", icon: Home },
];

const ACCOUNT_STATUSES: { value: AccountStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "paid", label: "Paid Off" },
    { value: "collection", label: "Collection" },
    { value: "chargeoff", label: "Charge-Off" },
];

// Tradeline card component
function TradelineCard({
    tradeline,
    onEdit,
    onDelete
}: {
    tradeline: Tradeline;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const utilization = tradeline.creditLimit
        ? calculateUtilization(tradeline.currentBalance || 0, tradeline.creditLimit)
        : null;

    const utilizationBand = utilization !== null ? getUtilizationBand(utilization) : null;

    const statusColors: Record<AccountStatus, string> = {
        open: "bg-green-500/10 text-green-700 border-green-500/20",
        closed: "bg-gray-500/10 text-gray-700 border-gray-500/20",
        paid: "bg-blue-500/10 text-blue-700 border-blue-500/20",
        collection: "bg-red-500/10 text-red-700 border-red-500/20",
        chargeoff: "bg-red-500/10 text-red-700 border-red-500/20",
    };

    const TypeIcon = ACCOUNT_TYPES.find(t => t.value === tradeline.accountType)?.icon || CreditCard;

    return (
        <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-all gap-4">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                    <TypeIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-medium">{tradeline.creditorName}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className={statusColors[tradeline.accountStatus]}>
                            {tradeline.accountStatus}
                        </Badge>
                        {tradeline.hasPersonalGuarantee && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                PG
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Balance / Limit */}
                {tradeline.accountType === "revolving" && (
                    <div className="text-right">
                        <p className="text-sm font-medium">
                            ${(tradeline.currentBalance || 0).toLocaleString()} / ${(tradeline.creditLimit || 0).toLocaleString()}
                        </p>
                        {utilization !== null && (
                            <p className={`text-xs ${utilization <= 10 ? "text-green-600" :
                                utilization <= 30 ? "text-yellow-600" :
                                    "text-red-600"
                                }`}>
                                {utilization}% utilization
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function Step2TradelineManager({ data, onSave, tradelines = [], onRefreshTradelines }: Step2Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Tradeline>>({
        accountType: "revolving",
        accountStatus: "open",
        isBusinessCredit: false,
    });

    const resetForm = () => {
        setFormData({
            accountType: "revolving",
            accountStatus: "open",
            isBusinessCredit: false,
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

    const handleSave = async () => {
        if (!formData.creditorName) {
            toast.error("Creditor name is required");
            return;
        }

        if (!data.id) {
            toast.error("Please wait for profile specific data to save...");
            return;
        }

        setIsSaving(true);
        try {
            const result = await saveTradeline({
                ...formData,
                id: editingTradeline?.id,
                personalProfileId: data.id,
            });

            if (result.success) {
                toast.success(editingTradeline ? "Account updated" : "Account added");
                setIsDialogOpen(false);
                resetForm();
                onRefreshTradelines?.();
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch {
            toast.error("Failed to save account");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const result = await deleteTradeline(id);
            if (result.success) {
                toast.success("Account deleted");
                onRefreshTradelines?.();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(null);
        }
    };

    // Calculate totals
    const revolvingAccounts = tradelines.filter(t => t.accountType === "revolving" && t.accountStatus === "open");
    const totalLimit = revolvingAccounts.reduce((sum, t) => sum + (t.creditLimit || 0), 0);
    const totalBalance = revolvingAccounts.reduce((sum, t) => sum + (t.currentBalance || 0), 0);
    const overallUtilization = calculateUtilization(totalBalance, totalLimit);

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/50 border">
                <div>
                    <h3 className="font-semibold">{tradelines.length} Account{tradelines.length !== 1 ? 's' : ''} Tracked</h3>
                    {totalLimit > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Overall Utilization: <span className={`font-medium ${overallUtilization <= 10 ? "text-green-600" :
                                overallUtilization <= 30 ? "text-yellow-600" :
                                    "text-red-600"
                                }`}>{overallUtilization}%</span>
                        </p>
                    )}
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Account
                </Button>
            </div>

            {/* Tradeline List */}
            <div className="space-y-3">
                {tradelines.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No accounts added yet</p>
                        <p className="text-sm">Add your credit cards, loans, and other accounts to track utilization</p>
                    </div>
                ) : (
                    tradelines.map((tradeline) => (
                        <TradelineCard
                            key={tradeline.id}
                            tradeline={tradeline}
                            onEdit={() => handleOpenDialog(tradeline)}
                            onDelete={() => setIsDeleting(tradeline.id!)}
                        />
                    ))
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingTradeline ? "Edit Account" : "Add New Account"}</DialogTitle>
                        <DialogDescription>
                            {editingTradeline
                                ? "Update the details of this credit account"
                                : "Add a credit card, loan, or other account to track"
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Creditor Name */}
                        <div className="space-y-2">
                            <Label htmlFor="creditor">Creditor Name</Label>
                            <Input
                                id="creditor"
                                placeholder="e.g., Chase, Capital One, Wells Fargo"
                                value={formData.creditorName || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
                            />
                        </div>

                        {/* Account Type & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Account Type</Label>
                                <Select
                                    value={formData.accountType}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, accountType: v as AccountType }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCOUNT_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.accountStatus}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, accountStatus: v as AccountStatus }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCOUNT_STATUSES.map(status => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Balance & Limit (for revolving) */}
                        {formData.accountType === "revolving" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="balance">Current Balance</Label>
                                    <Input
                                        id="balance"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={formData.currentBalance || ""}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            currentBalance: e.target.value ? parseFloat(e.target.value) : undefined
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="limit">Credit Limit</Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={formData.creditLimit || ""}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            creditLimit: e.target.value ? parseFloat(e.target.value) : undefined
                                        }))}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Statement Close Date */}
                        {formData.accountType === "revolving" && (
                            <div className="space-y-2">
                                <Label>Statement Closes On</Label>
                                <Select
                                    value={formData.statementCloseDate?.toString() || ""}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, statementCloseDate: parseInt(v) }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day of month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                            <SelectItem key={day} value={day.toString()}>
                                                {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of the month
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    💡 Pay down before this date to lower reported utilization
                                </p>
                            </div>
                        )}

                        {/* Date Opened */}
                        <div className="space-y-2">
                            <Label htmlFor="dateOpened">Date Opened</Label>
                            <Input
                                id="dateOpened"
                                type="date"
                                value={formData.dateOpened || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, dateOpened: e.target.value }))}
                            />
                        </div>

                        {/* PG Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                            <div>
                                <Label htmlFor="pg" className="text-sm font-medium">Has Personal Guarantee</Label>
                                <p className="text-xs text-muted-foreground">This business account is backed by your personal credit</p>
                            </div>
                            <Switch
                                id="pg"
                                checked={formData.hasPersonalGuarantee || false}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasPersonalGuarantee: checked }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingTradeline ? "Update" : "Add Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this account from your credit profile. This action cannot be undone.
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
