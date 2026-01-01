"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2, Phone, Mail, Key, UserCheck, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialResilienceData } from "@/actions/resilience";

interface StepProps {
    data: FinancialResilienceData;
    onSave: (data: Partial<FinancialResilienceData>) => void;
}

const FINANCIAL_ROLES = [
    "CFO",
    "Controller",
    "Accountant",
    "Bookkeeper",
    "Financial Advisor",
    "Tax Preparer",
    "Auditor",
    "Payroll Admin",
    "AP/AR Clerk",
    "Board Treasurer",
    "Other"
];

const ACCESS_LEVELS = [
    { id: "full", label: "Full Access", description: "All financial systems" },
    { id: "limited", label: "Limited Access", description: "Read-only or specific areas" },
    { id: "emergency", label: "Emergency Only", description: "Break-glass access" },
    { id: "none", label: "Advisory Only", description: "No direct system access" },
];

export function Step8FinancialBackupContacts({ data, onSave }: StepProps) {
    const [selectedRole, setSelectedRole] = useState("");
    const contacts = data.financialContacts || [];

    const addContact = () => {
        if (!selectedRole) return;
        const newContact = {
            id: crypto.randomUUID(),
            role: selectedRole,
            name: "",
            email: "",
            phone: "",
            company: "",
            accessLevel: "limited",
            hasCredentials: false,
            isSuccessor: false
        };
        onSave({ financialContacts: [...contacts, newContact] });
        setSelectedRole("");
    };

    const updateContact = (id: string, field: string, value: string | boolean) => {
        const updated = contacts.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );
        onSave({ financialContacts: updated });
    };

    const removeContact = (id: string) => {
        onSave({ financialContacts: contacts.filter(c => c.id !== id) });
    };

    const successors = contacts.filter(c => c.isSuccessor);
    const withCredentials = contacts.filter(c => c.hasCredentials);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Financial Backup Contacts
                </h3>
                <p className="text-sm text-muted-foreground">Who can step in if your CFO or accountant is unavailable?</p>
            </div>

            {/* Successor Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-muted/30">
                    <div className="text-sm text-muted-foreground">Total Contacts</div>
                    <div className="text-xl font-bold">{contacts.length}</div>
                </div>
                <div className="p-4 rounded-xl border bg-green-50 border-green-200">
                    <div className="text-sm text-green-700">Designated Successors</div>
                    <div className="text-xl font-bold text-green-700">{successors.length}</div>
                </div>
                <div className="p-4 rounded-xl border bg-amber-50 border-amber-200">
                    <div className="text-sm text-amber-700">With Credentials</div>
                    <div className="text-xl font-bold text-amber-700">{withCredentials.length}</div>
                </div>
            </div>

            {/* Key Succession Roles */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        CFO/Finance Successor
                    </Label>
                    <Input
                        placeholder="Name of CFO successor..."
                        value={data.cfoSuccessor || ""}
                        onChange={(e) => onSave({ cfoSuccessor: e.target.value })}
                    />
                    <p className="text-[10px] text-muted-foreground">Who takes over financial leadership?</p>
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        Accountant Successor
                    </Label>
                    <Input
                        placeholder="Name of accountant successor..."
                        value={data.accountantSuccessor || ""}
                        onChange={(e) => onSave({ accountantSuccessor: e.target.value })}
                    />
                    <p className="text-[10px] text-muted-foreground">Backup for day-to-day accounting</p>
                </div>
            </div>

            {/* Contact List */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <Label className="text-base">Financial Team & Advisors</Label>

                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div key={contact.id} className={cn(
                            "p-4 rounded-xl border bg-card space-y-4",
                            contact.isSuccessor ? "ring-2 ring-green-500/50" : ""
                        )}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                        {contact.role}
                                    </Badge>
                                    {contact.isSuccessor && (
                                        <Badge className="bg-green-500">
                                            <UserCheck className="w-3 h-3 mr-1" /> Successor
                                        </Badge>
                                    )}
                                    {contact.hasCredentials && (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                            <Key className="w-3 h-3 mr-1" /> Has Credentials
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeContact(contact.id)}>
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                                    <Input
                                        placeholder="John Smith"
                                        value={contact.name}
                                        onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> Company/Firm
                                    </Label>
                                    <Input
                                        placeholder="CPA Firm LLC"
                                        value={contact.company}
                                        onChange={(e) => updateContact(contact.id, "company", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Phone
                                    </Label>
                                    <Input
                                        placeholder="(555) 555-5555"
                                        value={contact.phone}
                                        onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="john@cpa.com"
                                        value={contact.email}
                                        onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-dashed">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Access Level</Label>
                                    <Select value={contact.accessLevel} onValueChange={(v) => updateContact(contact.id, "accessLevel", v)}>
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ACCESS_LEVELS.map(l => (
                                                <SelectItem key={l.id} value={l.id}>
                                                    <div className="flex flex-col">
                                                        <span>{l.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                                    <span className="text-xs font-medium">Has Credentials</span>
                                    <Switch
                                        checked={contact.hasCredentials}
                                        onCheckedChange={(v) => updateContact(contact.id, "hasCredentials", v)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg border bg-green-50/50">
                                    <span className="text-xs font-medium">Is Successor</span>
                                    <Switch
                                        checked={contact.isSuccessor}
                                        onCheckedChange={(v) => updateContact(contact.id, "isSuccessor", v)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent>
                            {FINANCIAL_ROLES.map(r => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={addContact} disabled={!selectedRole}>
                        <Plus className="w-4 h-4 mr-1" /> Add Contact
                    </Button>
                </div>
            </div>
        </div>
    );
}
