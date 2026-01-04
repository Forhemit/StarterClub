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
    Store,
    Loader2,
    CheckCircle2,
    Lock
} from "lucide-react";
import { toast } from "sonner";
import type { BusinessCreditData, Tradeline, TierLevel } from "../types";
import { saveTradeline, deleteTradeline } from "@/actions/credit-actions";
import { BUSINESS_TIERS } from "../types";

interface Step3Props {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
    tradelines?: Tradeline[];
    onRefreshTradelines?: () => Promise<void>;
}

const POPULAR_STORE_CARDS = [
    { name: "Amazon Business", category: "E-Commerce" },
    { name: "Staples Business", category: "Office Supplies" },
    { name: "Home Depot Pro", category: "Hardware" },
    { name: "Lowes Business", category: "Hardware" },
    { name: "Office Depot", category: "Office Supplies" },
    { name: "Sam's Club Business", category: "Wholesale" },
    { name: "Costco Business", category: "Wholesale" },
    { name: "Best Buy Business", category: "Electronics" },
];

const APPLICATION_STATUSES = [
    { value: "not_applied", label: "Not Applied" },
    { value: "applied", label: "Applied - Pending" },
    { value: "approved", label: "Approved" },
    { value: "denied", label: "Denied" },
];

export function Step3Tier2StoreCredit({ data, onSave, tradelines = [], onRefreshTradelines }: Step3Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Check if Tier 1 is complete
    const tier1Accounts = tradelines.filter(t => t.tierLevel === 1);
    const tier1Complete = tier1Accounts.filter(t => t.reportsToDnb || t.reportsToExperian).length >= 3;

    // Filter for Tier 2 accounts
    const tier2Accounts = tradelines.filter(t => t.tierLevel === 2);

    // Form state
    const [formData, setFormData] = useState<Partial<Tradeline>>({
        accountType: "revolving",
        accountStatus: "open",
        isBusinessCredit: true,
        tierLevel: 2,
    });

    const resetForm = () => {
        setFormData({
            accountType: "revolving",
            accountStatus: "open",
            isBusinessCredit: true,
            tierLevel: 2,
        });
        setEditingTradeline(null);
    };

    const handleOpenDialog = (tradeline?: Tradeline) => {
        if (!tier1Complete && !tradeline) {
            toast.error("Complete Tier 1 first (3+ reporting accounts)");
            return;
        }
        if (tradeline) {
            setEditingTradeline(tradeline);
            setFormData(tradeline);
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSelectCard = (cardName: string) => {
        if (!tier1Complete) {
            toast.error("Complete Tier 1 first (3+ reporting accounts)");
            return;
        }
        setFormData(prev => ({ ...prev, creditorName: cardName }));
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.creditorName) {
            toast.error("Card name is required");
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
                toast.success(editingTradeline ? "Card updated" : "Card added");
                setIsDialogOpen(false);
                resetForm();
                onRefreshTradelines?.();

                // Update tier completion status
                if (tier2Accounts.length >= 1) {
                    onSave({ tier2Complete: true, currentTier: Math.max(data.currentTier || 0, 2) as TierLevel });
                }
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch {
            toast.error("Failed to save card");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteTradeline(id);
            if (result.success) {
                toast.success("Card deleted");
                onRefreshTradelines?.();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete card");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tier Info */}
            <div className={`p-4 rounded-xl border ${tier1Complete
                ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                : "bg-muted/50 border-border"
                }`}>
                <div className="flex items-start gap-3">
                    <Store className={`w-5 h-5 mt-0.5 ${tier1Complete ? "text-blue-600" : "text-muted-foreground"}`} />
                    <div>
                        <h4 className={`font-medium ${tier1Complete ? "text-blue-900 dark:text-blue-100" : "text-muted-foreground"}`}>
                            {BUSINESS_TIERS[2].name}
                        </h4>
                        <p className={`text-sm ${tier1Complete ? "text-blue-800 dark:text-blue-200" : "text-muted-foreground"}`}>
                            {BUSINESS_TIERS[2].description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                            Requirement: {BUSINESS_TIERS[2].requirement}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Lock Notice */}
            {!tier1Complete && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-100">Tier 2 Locked</h4>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            Complete Tier 1 with 3+ vendors reporting to bureaus before applying for store cards.
                        </p>
                    </div>
                </div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div>
                    <h3 className="font-semibold">{tier2Accounts.length} Store Card{tier2Accounts.length !== 1 ? 's' : ''}</h3>
                    <p className="text-sm text-muted-foreground">
                        {tier2Accounts.length >= 2 ? "✅ Ready for Tier 3" : `Add ${2 - tier2Accounts.length} more for Tier 3`}
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="gap-2"
                    disabled={!tier1Complete}
                >
                    <Plus className="w-4 h-4" />
                    Add Card
                </Button>
            </div>

            {/* Popular Store Cards */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Popular Store Cards</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    These retailers offer business credit cards with easier approval after Tier 1.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POPULAR_STORE_CARDS.map((card) => {
                        const isAdded = tier2Accounts.some(t =>
                            t.creditorName.toLowerCase().includes(card.name.toLowerCase())
                        );

                        return (
                            <div
                                key={card.name}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAdded
                                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                    : !tier1Complete
                                        ? "bg-muted/30 border-border opacity-60"
                                        : "bg-card hover:bg-muted/50"
                                    }`}
                            >
                                <div>
                                    <h4 className="font-medium flex items-center gap-2">
                                        {card.name}
                                        {isAdded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {card.category}
                                    </p>
                                </div>
                                {!isAdded && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSelectCard(card.name)}
                                        disabled={!tier1Complete}
                                    >
                                        {tier1Complete ? "Add" : <Lock className="w-4 h-4" />}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Existing Accounts */}
            {tier2Accounts.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Your Tier 2 Cards</Label>

                    <div className="grid gap-3">
                        {tier2Accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between p-4 rounded-xl border bg-card"
                            >
                                <div className="flex items-center gap-4">
                                    <Store className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium">{account.creditorName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {account.creditLimit && (
                                                <Badge variant="outline" className="text-xs">
                                                    ${account.creditLimit.toLocaleString()} limit
                                                </Badge>
                                            )}
                                            {account.hasPersonalGuarantee && (
                                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                                                    PG
                                                </Badge>
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
                        <DialogTitle>{editingTradeline ? "Edit Store Card" : "Add Store Card"}</DialogTitle>
                        <DialogDescription>
                            Track a Tier 2 retail store credit card
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardName">Store/Card Name</Label>
                            <Input
                                id="cardName"
                                placeholder="e.g., Amazon Business, Staples"
                                value={formData.creditorName || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="creditLimit">Credit Limit</Label>
                                <Input
                                    id="creditLimit"
                                    type="number"
                                    min={0}
                                    placeholder="5000"
                                    value={formData.creditLimit || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        creditLimit: e.target.value ? parseFloat(e.target.value) : undefined
                                    }))}
                                />
                            </div>
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

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                            <div>
                                <Label htmlFor="pg" className="text-sm font-medium">Personal Guarantee</Label>
                                <p className="text-xs text-muted-foreground">Card requires your personal credit</p>
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
                            {editingTradeline ? "Update" : "Add Card"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Card?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove this store card from your Tier 2 tracking.
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
