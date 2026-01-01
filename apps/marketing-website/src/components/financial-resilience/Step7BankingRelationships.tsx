"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, Trash2, Phone, Mail, CreditCard, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const ACCOUNT_TYPES = [
    "Operating",
    "Payroll",
    "Savings",
    "Investment",
    "Line of Credit",
    "Merchant Services",
    "Money Market",
    "Other"
];

export function Step7BankingRelationships({ data, onSave }: StepProps) {
    const [newBankName, setNewBankName] = useState("");
    const contacts = data.bankingContacts || [];

    const addContact = () => {
        if (!newBankName.trim()) return;
        const newContact = {
            id: crypto.randomUUID(),
            bankName: newBankName,
            accountType: "Operating",
            contactName: "",
            contactPhone: "",
            contactEmail: "",
            isPrimary: contacts.length === 0, // First one is primary by default
            creditLineAmount: 0
        };
        onSave({ bankingContacts: [...contacts, newContact] });
        setNewBankName("");
    };

    const updateContact = (id: string, field: string, value: string | number | boolean) => {
        let updated = contacts.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );

        // If setting this as primary, unset others
        if (field === "isPrimary" && value === true) {
            updated = updated.map(c => ({
                ...c,
                isPrimary: c.id === id
            }));
        }

        onSave({ bankingContacts: updated });
    };

    const removeContact = (id: string) => {
        onSave({ bankingContacts: contacts.filter(c => c.id !== id) });
    };

    const totalCreditLines = contacts.reduce((sum, c) => sum + (c.creditLineAmount || 0), 0);
    const primaryBank = contacts.find(c => c.isPrimary);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Banking Relationships
                </h3>
                <p className="text-sm text-muted-foreground">Document your banking partners and credit lines.</p>
            </div>

            {/* Primary/Backup Bank Selection */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Primary Bank</Label>
                    <Select
                        value={data.primaryBank || ""}
                        onValueChange={(v) => onSave({ primaryBank: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select primary bank..." />
                        </SelectTrigger>
                        <SelectContent>
                            {contacts.map(c => (
                                <SelectItem key={c.id} value={c.bankName}>{c.bankName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Backup Bank</Label>
                    <Select
                        value={data.backupBank || ""}
                        onValueChange={(v) => onSave({ backupBank: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select backup bank..." />
                        </SelectTrigger>
                        <SelectContent>
                            {contacts.filter(c => c.bankName !== data.primaryBank).map(c => (
                                <SelectItem key={c.id} value={c.bankName}>{c.bankName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Credit Summary */}
            <div className="p-4 rounded-xl border bg-muted/30 flex justify-between items-center">
                <div>
                    <div className="text-sm text-muted-foreground">Total Credit Available</div>
                    <div className="text-xl font-bold">${totalCreditLines.toLocaleString()}</div>
                </div>
                <Badge variant="outline" className="text-lg">
                    {contacts.length} relationships
                </Badge>
            </div>

            {/* Banking Contacts */}
            <div className="space-y-4">
                <Label className="text-base">Bank Accounts & Contacts</Label>

                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div key={contact.id} className={cn(
                            "p-4 rounded-xl border bg-card space-y-4",
                            contact.isPrimary ? "ring-2 ring-primary/50" : ""
                        )}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-muted-foreground" />
                                    <Input
                                        value={contact.bankName}
                                        onChange={(e) => updateContact(contact.id, "bankName", e.target.value)}
                                        className="border-0 bg-transparent p-0 h-auto text-base font-semibold focus-visible:ring-0 w-auto"
                                    />
                                    {contact.isPrimary && (
                                        <Badge className="bg-primary">
                                            <Star className="w-3 h-3 mr-1" /> Primary
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Primary</span>
                                        <Switch
                                            checked={contact.isPrimary}
                                            onCheckedChange={(v) => updateContact(contact.id, "isPrimary", v)}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeContact(contact.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Account Type</Label>
                                    <Select value={contact.accountType} onValueChange={(v) => updateContact(contact.id, "accountType", v)}>
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ACCOUNT_TYPES.map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CreditCard className="w-3 h-3" /> Credit Line
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="$0"
                                        value={contact.creditLineAmount || ""}
                                        onChange={(e) => updateContact(contact.id, "creditLineAmount", parseFloat(e.target.value) || 0)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Contact Name</Label>
                                    <Input
                                        placeholder="Banker Name"
                                        value={contact.contactName}
                                        onChange={(e) => updateContact(contact.id, "contactName", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Phone
                                    </Label>
                                    <Input
                                        placeholder="(555) 555-5555"
                                        value={contact.contactPhone}
                                        onChange={(e) => updateContact(contact.id, "contactPhone", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="banker@bank.com"
                                    value={contact.contactEmail}
                                    onChange={(e) => updateContact(contact.id, "contactEmail", e.target.value)}
                                    className="h-8 text-sm max-w-md"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Add bank name..."
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addContact()}
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={addContact} disabled={!newBankName.trim()}>
                        <Plus className="w-4 h-4 mr-1" /> Add Bank
                    </Button>
                </div>
            </div>
        </div>
    );
}
