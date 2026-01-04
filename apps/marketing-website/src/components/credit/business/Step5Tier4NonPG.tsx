"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
    Landmark,
    Loader2,
    CheckCircle2,
    Lock,
    Trophy,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import type { BusinessCreditData, Tradeline } from "../types";
import { saveTradeline, deleteTradeline } from "@/actions/credit-actions";
import { BUSINESS_TIERS } from "../types";

interface Step5Props {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
    tradelines?: Tradeline[];
    onRefreshTradelines?: () => Promise<void>;
}

const POPULAR_NONPG_OPTIONS = [
    { name: "American Express Business Gold (No PG)", type: "Credit Card", requirement: "2+ years, strong PAYDEX" },
    { name: "Brex Business Card", type: "Credit Card", requirement: "Strong revenue, no PG" },
    { name: "Ramp Business Card", type: "Credit Card", requirement: "Strong revenue, no PG" },
    { name: "Divvy (No PG option)", type: "Credit Card", requirement: "Bank history, revenue" },
    { name: "Bluevine Line of Credit", type: "Line of Credit", requirement: "$250K+ revenue" },
    { name: "Fundbox Line of Credit", type: "Line of Credit", requirement: "$100K+ revenue" },
];

export function Step5Tier4NonPG({ data, onSave, tradelines = [], onRefreshTradelines }: Step5Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Check if Tier 3 is complete
    const tier3Accounts = tradelines.filter(t => t.tierLevel === 3);
    const tier3Complete = tier3Accounts.length >= 2;

    // Filter for Tier 4 accounts (Non-PG)
    const tier4Accounts = tradelines.filter(t => t.tierLevel === 4);
    const nonPgAccounts = tier4Accounts.filter(t => !t.hasPersonalGuarantee);

    // Form state
    const [formData, setFormData] = useState<Partial<Tradeline>>({
        accountType: "revolving",
        accountStatus: "open",
        isBusinessCredit: true,
        tierLevel: 4,
        hasPersonalGuarantee: false,
    });

    const resetForm = () => {
        setFormData({
            accountType: "revolving",
            accountStatus: "open",
            isBusinessCredit: true,
            tierLevel: 4,
            hasPersonalGuarantee: false,
        });
        setEditingTradeline(null);
    };

    const handleOpenDialog = (tradeline?: Tradeline) => {
        if (!tier3Complete && !tradeline) {
            toast.error("Complete Tier 3 first (2+ bank/fleet cards)");
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

    const handleSelectOption = (name: string) => {
        if (!tier3Complete) {
            toast.error("Complete Tier 3 first (2+ bank/fleet cards)");
            return;
        }
        setFormData(prev => ({ ...prev, creditorName: name, hasPersonalGuarantee: false }));
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.creditorName) {
            toast.error("Product name is required");
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
                toast.success(editingTradeline ? "Product updated" : "Product added");
                setIsDialogOpen(false);
                resetForm();
                onRefreshTradelines?.();

                if (nonPgAccounts.length >= 1) {
                    onSave({ tier4Complete: true, currentTier: 4 });
                }
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch {
            toast.error("Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteTradeline(id);
            if (result.success) {
                toast.success("Product deleted");
                onRefreshTradelines?.();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tier Info / Victory Banner */}
            <div className={`p-4 rounded-xl border ${tier3Complete
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800"
                    : "bg-muted/50 border-border"
                }`}>
                <div className="flex items-start gap-3">
                    <Trophy className={`w-5 h-5 mt-0.5 ${tier3Complete ? "text-amber-600" : "text-muted-foreground"}`} />
                    <div>
                        <h4 className={`font-medium ${tier3Complete ? "text-amber-900 dark:text-amber-100" : "text-muted-foreground"}`}>
                            {BUSINESS_TIERS[4].name}
                        </h4>
                        <p className={`text-sm ${tier3Complete ? "text-amber-800 dark:text-amber-200" : "text-muted-foreground"}`}>
                            {BUSINESS_TIERS[4].description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                            Requirement: {BUSINESS_TIERS[4].requirement}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Lock Notice */}
            {!tier3Complete && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-100">Tier 4 Locked</h4>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            Complete Tier 3 with 2+ bank/fleet cards and establish strong PAYDEX before applying for Non-PG funding.
                        </p>
                    </div>
                </div>
            )}

            {/* Achievement Banner */}
            {nonPgAccounts.length > 0 && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                    <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">🎉 Non-PG Unlocked!</h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                            You have {nonPgAccounts.length} credit line{nonPgAccounts.length !== 1 ? 's' : ''} not backed by your personal credit.
                        </p>
                    </div>
                </div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div>
                    <h3 className="font-semibold">{tier4Accounts.length} Product{tier4Accounts.length !== 1 ? 's' : ''}</h3>
                    <p className="text-sm text-muted-foreground">
                        {nonPgAccounts.length} without Personal Guarantee
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="gap-2"
                    disabled={!tier3Complete}
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Popular Non-PG Options */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Popular Non-PG Options</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    These products may approve without a personal guarantee for established businesses.
                </p>

                <div className="grid gap-3">
                    {POPULAR_NONPG_OPTIONS.map((option) => {
                        const isAdded = tier4Accounts.some(t =>
                            t.creditorName.toLowerCase().includes(option.name.split(" ")[0].toLowerCase())
                        );

                        return (
                            <div
                                key={option.name}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAdded
                                        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                        : !tier3Complete
                                            ? "bg-muted/30 border-border opacity-60"
                                            : "bg-card hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Landmark className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium flex items-center gap-2">
                                            {option.name}
                                            {isAdded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {option.type} • {option.requirement}
                                        </p>
                                    </div>
                                </div>
                                {!isAdded && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSelectOption(option.name)}
                                        disabled={!tier3Complete}
                                    >
                                        {tier3Complete ? "Add" : <Lock className="w-4 h-4" />}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Existing Accounts */}
            {tier4Accounts.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Your Tier 4 Products</Label>

                    <div className="grid gap-3">
                        {tier4Accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between p-4 rounded-xl border bg-card"
                            >
                                <div className="flex items-center gap-4">
                                    <Landmark className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium">{account.creditorName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {account.creditLimit && (
                                                <Badge variant="outline" className="text-xs">
                                                    ${account.creditLimit.toLocaleString()} limit
                                                </Badge>
                                            )}
                                            {account.hasPersonalGuarantee ? (
                                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                                                    PG
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                                    No PG ✓
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
                        <DialogTitle>{editingTradeline ? "Edit Product" : "Add Tier 4 Product"}</DialogTitle>
                        <DialogDescription>
                            Track a non-PG credit card or line of credit
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                                id="productName"
                                placeholder="e.g., Brex, Bluevine LOC"
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
                                    placeholder="25000"
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

                        <div className={`flex items-center justify-between p-3 rounded-lg border ${!formData.hasPersonalGuarantee
                                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                : "bg-muted/50"
                            }`}>
                            <div>
                                <Label htmlFor="pg" className="text-sm font-medium">Personal Guarantee</Label>
                                <p className="text-xs text-muted-foreground">
                                    {formData.hasPersonalGuarantee ? "Backed by personal credit" : "✓ True business credit!"}
                                </p>
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
                            {editingTradeline ? "Update" : "Add Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove this product from your Tier 4 tracking.
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
