"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Building, Globe, User, Star, Mail } from "lucide-react";
import { toast } from "sonner";

interface PartnershipTabProps {
    profile: any;
}

const partnershipTiers = [
    { value: "bronze", label: "Bronze", color: "bg-amber-700" },
    { value: "silver", label: "Silver", color: "bg-gray-400" },
    { value: "gold", label: "Gold", color: "bg-yellow-500" },
    { value: "platinum", label: "Platinum", color: "bg-slate-300" },
];

export function PartnershipTab({ profile }: PartnershipTabProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        companyName: profile?.company_name || "",
        website: profile?.website || "",
        tier: profile?.partnership_tier || "bronze",
        primaryContact: profile?.primary_contact || "",
        contactEmail: profile?.contact_email || "",
        contactPhone: profile?.contact_phone || "",
        relationshipManager: profile?.relationship_manager || "Assigned on request",
    });

    const currentTier = partnershipTiers.find(t => t.value === formData.tier);

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement partnership update action
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Partnership details updated successfully");
        } catch (error) {
            toast.error("Failed to update partnership details");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Partnership Status */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                Partnership Status
                            </CardTitle>
                            <CardDescription>Your current partnership tier and benefits.</CardDescription>
                        </div>
                        <Badge className={`${currentTier?.color} text-white`}>
                            {currentTier?.label} Partner
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                            Want to upgrade your partnership tier?
                        </p>
                        <Button variant="outline" size="sm">
                            View Upgrade Options →
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        Company Information
                    </CardTitle>
                    <CardDescription>Your organization's details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                placeholder="Acme Inc."
                                value={formData.companyName}
                                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website" className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5" />
                                Website
                            </Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.website}
                                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Primary Contact
                    </CardTitle>
                    <CardDescription>The main point of contact for partnership communications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="primaryContact">Contact Name</Label>
                        <Input
                            id="primaryContact"
                            placeholder="Full name"
                            value={formData.primaryContact}
                            onChange={(e) => setFormData(prev => ({ ...prev, primaryContact: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail" className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                            </Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                placeholder="contact@example.com"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Phone</Label>
                            <Input
                                id="contactPhone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Relationship Manager */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Your Relationship Manager</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{formData.relationshipManager}</p>
                            <p className="text-sm text-muted-foreground">Contact for partnership inquiries</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
