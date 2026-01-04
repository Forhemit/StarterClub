
"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Building2, User, Mail, Tag, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnterpriseRepositoryData, InterestedParty, PartyRole } from "./types";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface Step1Props {
    data: EnterpriseRepositoryData;
    onUpdate: (data: Partial<EnterpriseRepositoryData>) => void;
}

export function Step1InterestedParties({ data, onUpdate }: Step1Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<PartyRole>("investor");
    const [notes, setNotes] = useState("");

    const resetForm = () => {
        setCompanyName("");
        setContactName("");
        setEmail("");
        setRole("investor");
        setNotes("");
        setEditingId(null);
    };

    const handleSaveParty = () => {
        if (!companyName || !contactName || !email) {
            toast.error("Please fill in all required fields");
            return;
        }

        const newParty: InterestedParty = {
            id: editingId || uuidv4(),
            companyName,
            contactName,
            email,
            role,
            notes,
            addedAt: new Date().toISOString(),
        };

        let updatedList: InterestedParty[];
        if (editingId) {
            updatedList = data.interestedParties.map(p => p.id === editingId ? newParty : p);
            toast.success("Party updated successfully");
        } else {
            updatedList = [...data.interestedParties, newParty];
            toast.success("New interested party added");
        }

        onUpdate({ interestedParties: updatedList });
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (party: InterestedParty) => {
        setEditingId(party.id);
        setCompanyName(party.companyName);
        setContactName(party.contactName);
        setEmail(party.email);
        setRole(party.role);
        setNotes(party.notes || "");
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const updatedList = data.interestedParties.filter(p => p.id !== id);
        // Also clean up access rules for this party
        const updatedRules = { ...data.accessRules };
        delete updatedRules[id];

        onUpdate({
            interestedParties: updatedList,
            accessRules: updatedRules
        });
        toast.success("Party removed");
    };

    const getRoleBadgeColor = (role: PartyRole) => {
        switch (role) {
            case "investor": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "ma_firm": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "attorney": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            case "vendor": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getRoleLabel = (role: PartyRole) => {
        switch (role) {
            case "ma_firm": return "M&A Firm";
            default: return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Manage Interested Parties</h3>
                <p className="text-sm text-muted-foreground">
                    Add the external organizations that need access to your documents. You will configure their specific permissions in the next step.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Add New Card */}
                <Button
                    variant="outline"
                    className="h-[200px] flex flex-col items-center justify-center gap-4 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                    onClick={() => {
                        resetForm();
                        setIsDialogOpen(true);
                    }}
                >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span>Add New Party</span>
                </Button>

                {/* Party Cards */}
                {data.interestedParties.map((party) => (
                    <Card key={party.id} className="relative group hover:shadow-md transition-shadow">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(party)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(party.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start pr-12">
                                <div className="space-y-1">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="leading-tight">{party.companyName}</CardTitle>
                                    <Badge variant="secondary" className={`mt-1 font-normal ${getRoleBadgeColor(party.role)}`}>
                                        {getRoleLabel(party.role)}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="truncate">{party.contactName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{party.email}</span>
                            </div>
                            {party.notes && (
                                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground line-clamp-2">
                                    {party.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Party' : 'Add Interested Party'}</DialogTitle>
                        <DialogDescription>
                            Enter the details of the company or individual requiring access.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="company"
                                    placeholder="e.g. Acme Capital"
                                    className="pl-9"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Person <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="contact"
                                        placeholder="e.g. John Doe"
                                        className="pl-9"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role} onValueChange={(val: PartyRole) => setRole(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="investor">Investor</SelectItem>
                                        <SelectItem value="ma_firm">M&A Firm</SelectItem>
                                        <SelectItem value="attorney">Attorney</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes"
                                placeholder="Internal reference notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveParty}>{editingId ? 'Update Party' : 'Add Party'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
