"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, UserRound, Loader2 } from "lucide-react";
import { createOrUpdateLegalContact, getLegalContactsForEntity, deleteLegalContact, EntityLegalContact, AttorneyType } from "@/actions/legal-contacts";
import { toast } from "sonner";

const ATTORNEY_TYPES: AttorneyType[] = [
    'Corporate',
    'Tax',
    'IP',
    'Employment',
    'Litigation',
    'Real Estate',
    'General',
    'Other'
];

const US_STATES = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
];

// Phone formatting function: (###) ###-####
function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface AttorneyManagerProps {
    entityId: string;
    onUpdate?: () => void;
}

export function AttorneyManager({ entityId, onUpdate }: AttorneyManagerProps) {
    const [attorneys, setAttorneys] = useState<EntityLegalContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const hasMounted = useRef(false);

    // Empty attorney template
    const emptyAttorney: Omit<EntityLegalContact, 'id'> = {
        entity_id: entityId,
        role: 'attorney',
        name: '',
        attorney_type: 'General',
        phone: '',
        email: '',
        website: '',
        address_line1: '',
        city: '',
        state: '',
        zip: ''
    };

    const loadAttorneys = useCallback(async () => {
        if (!entityId) return;
        setIsLoading(true);
        try {
            const contacts = await getLegalContactsForEntity(entityId);
            setAttorneys(contacts.filter(c => c.role === 'attorney'));
        } catch (error) {
            console.error("Failed to load attorneys", error);
        } finally {
            setIsLoading(false);
        }
    }, [entityId]);

    // Only load once on mount
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            loadAttorneys();
        }
    }, [loadAttorneys]);

    async function handleAddAttorney() {
        setIsSaving(true);
        try {
            const result = await createOrUpdateLegalContact({
                ...emptyAttorney,
                name: 'New Attorney'
            });
            await loadAttorneys();
            onUpdate?.();
            toast.success("Attorney added");
        } catch (error: any) {
            toast.error("Failed to add attorney");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleUpdateAttorney(attorney: EntityLegalContact) {
        try {
            await createOrUpdateLegalContact(attorney);
            // Don't call onUpdate here to prevent render loops
            // Updates are saved silently on blur
        } catch (error) {
            toast.error("Failed to save attorney");
        }
    }

    async function handleDeleteAttorney(id: string) {
        if (!confirm("Delete this attorney?")) return;
        try {
            await deleteLegalContact(id);
            setAttorneys(prev => prev.filter(a => a.id !== id));
            onUpdate?.();
            toast.success("Attorney removed");
        } catch (error) {
            toast.error("Failed to delete attorney");
        }
    }

    function updateField(id: string, field: keyof EntityLegalContact, value: string) {
        setAttorneys(prev => prev.map(a =>
            a.id === id ? { ...a, [field]: value } : a
        ));
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {attorneys.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                    <UserRound className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No attorneys added yet</p>
                </div>
            ) : (
                attorneys.map((attorney, index) => (
                    <Card key={attorney.id} className="animate-in fade-in slide-in-from-bottom-2">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Attorney {index + 1}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteAttorney(attorney.id!)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={attorney.name}
                                        onChange={(e) => updateField(attorney.id!, 'name', e.target.value)}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="Attorney Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Attorney Type</Label>
                                    <Select
                                        value={attorney.attorney_type || 'General'}
                                        onValueChange={(v) => {
                                            updateField(attorney.id!, 'attorney_type', v);
                                            handleUpdateAttorney({ ...attorney, attorney_type: v as AttorneyType });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ATTORNEY_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        type="tel"
                                        value={attorney.phone || ''}
                                        onChange={(e) => updateField(attorney.id!, 'phone', formatPhone(e.target.value))}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={attorney.email || ''}
                                        onChange={(e) => updateField(attorney.id!, 'email', e.target.value)}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="attorney@lawfirm.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input
                                        type="url"
                                        value={attorney.website || ''}
                                        onChange={(e) => updateField(attorney.id!, 'website', e.target.value)}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="https://"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    value={attorney.address_line1 || ''}
                                    onChange={(e) => updateField(attorney.id!, 'address_line1', e.target.value)}
                                    onBlur={() => handleUpdateAttorney(attorney)}
                                    placeholder="Street Address"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        value={attorney.city || ''}
                                        onChange={(e) => updateField(attorney.id!, 'city', e.target.value)}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="City"
                                    />
                                    <Select
                                        value={attorney.state || ''}
                                        onValueChange={(v) => {
                                            updateField(attorney.id!, 'state', v);
                                            handleUpdateAttorney({ ...attorney, state: v });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {US_STATES.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        value={attorney.zip || ''}
                                        onChange={(e) => updateField(attorney.id!, 'zip', e.target.value)}
                                        onBlur={() => handleUpdateAttorney(attorney)}
                                        placeholder="ZIP"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}

            <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAddAttorney}
                disabled={isSaving}
            >
                {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4 mr-2" />
                )}
                Add Attorney
            </Button>
        </div>
    );
}
