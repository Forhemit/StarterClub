"use client";

import { useState } from "react";
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
import { Plus, Pencil, Trash2, Building2, Mail, Phone, Globe } from "lucide-react";
import { toast } from "sonner";
import { VendorManagementData, Vendor, VENDOR_CATEGORIES } from "./types";

interface Step1Props {
    data: VendorManagementData;
    onUpdate: (data: Partial<VendorManagementData>) => void;
}

const EMPTY_VENDOR: Vendor = {
    name: "",
    category: "Other",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    notes: "",
};

export function Step1VendorDirectory({ data, onUpdate }: Step1Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [formData, setFormData] = useState<Vendor>(EMPTY_VENDOR);

    const { vendors = [] } = data;

    const handleOpenNew = () => {
        setEditingVendor(null);
        setFormData({ ...EMPTY_VENDOR, id: crypto.randomUUID() });
        setIsDialogOpen(true);
    };

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setFormData({ ...vendor });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const updatedVendors = vendors.filter(v => v.id !== id);
        // Also remove contracts and spend records linked to this vendor
        const updatedContracts = (data.contracts || []).filter(c => c.vendor_id !== id);
        const updatedSpendRecords = (data.spend_records || []).filter(s => s.vendor_id !== id);
        onUpdate({
            vendors: updatedVendors,
            contracts: updatedContracts,
            spend_records: updatedSpendRecords
        });
        toast.success("Vendor removed");
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast.error("Vendor name is required");
            return;
        }

        let updatedVendors: Vendor[];
        if (editingVendor) {
            updatedVendors = vendors.map(v => v.id === formData.id ? formData : v);
            toast.success("Vendor updated");
        } else {
            updatedVendors = [...vendors, formData];
            toast.success("Vendor added");
        }

        onUpdate({ vendors: updatedVendors });
        setIsDialogOpen(false);
        setFormData(EMPTY_VENDOR);
        setEditingVendor(null);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            "Software": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            "Professional Services": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            "Marketing": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
            "Operations": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
            "HR": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            "Finance": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
            "Legal": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
            "IT Infrastructure": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
            "Other": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        };
        return colors[category] || colors["Other"];
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    Track all your vendors and their contact information in one place.
                </p>
                <Button onClick={handleOpenNew} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vendor
                </Button>
            </div>

            {vendors.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12 text-center bg-muted/10">
                    <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">No vendors yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Add your first vendor to start tracking relationships and contracts.
                    </p>
                    <Button onClick={handleOpenNew} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Your First Vendor
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {vendors.map((vendor) => (
                        <div
                            key={vendor.id}
                            className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(vendor.category || "Other")}`}>
                                            {vendor.category}
                                        </span>
                                    </div>
                                    {vendor.contact_name && (
                                        <p className="text-sm text-muted-foreground">
                                            Contact: {vendor.contact_name}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                        {vendor.contact_email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                {vendor.contact_email}
                                            </span>
                                        )}
                                        {vendor.contact_phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5" />
                                                {vendor.contact_phone}
                                            </span>
                                        )}
                                        {vendor.website && (
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5" />
                                                {vendor.website}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(vendor)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(vendor.id!)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            {vendor.notes && (
                                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t italic">
                                    {vendor.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Vendor Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
                        <DialogDescription>
                            {editingVendor ? "Update vendor information." : "Add a new vendor to your directory."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vendor-name">Vendor Name *</Label>
                                <Input
                                    id="vendor-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Acme Software Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vendor-category">Category</Label>
                                <Select
                                    value={formData.category}
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-name">Primary Contact Name</Label>
                            <Input
                                id="contact-name"
                                value={formData.contact_name || ""}
                                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                placeholder="e.g. John Smith"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">Email</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    value={formData.contact_email || ""}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    placeholder="john@acme.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">Phone</Label>
                                <Input
                                    id="contact-phone"
                                    value={formData.contact_phone || ""}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website || ""}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://acme.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes about this vendor..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {editingVendor ? "Update" : "Add"} Vendor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
