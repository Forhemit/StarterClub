import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { toast } from "sonner";
import { LegalVaultData } from "./types";
import { AddressRecord } from "@/actions/addresses"; // Keep for type compatibility for now

interface Step1Props {
    data: LegalVaultData;
    onUpdate: (data: Partial<LegalVaultData>) => void;
}

export function Step1CompanyProfile({ data, onUpdate }: Step1Props) {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressRecord | undefined>(undefined);

    // Initial State derived from props
    // We lift state up, so we use props directly or simple locals for inputs
    const { company_name, dba_name, has_dba, addresses } = data;

    const handleAddressDelete = (id: string) => {
        const updatedAddresses = addresses.filter(a => a.id !== id);
        onUpdate({ addresses: updatedAddresses as any }); // Cast if types slightly mismatch
        toast.success("Address removed from draft");
    };

    const handleAddressSave = (newAddr: any) => {
        let updatedAddresses;
        if (editingAddress) {
            updatedAddresses = addresses.map(a => a.id === newAddr.id ? newAddr : a);
        } else {
            updatedAddresses = [...addresses, newAddr];
        }
        onUpdate({ addresses: updatedAddresses as any });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid gap-6">

                {/* Company Name */}
                <div className="space-y-2">
                    <Label htmlFor="company-name">Legal Company Name</Label>
                    <Input
                        id="company-name"
                        placeholder="e.g. Acme Innovations, LLC"
                        value={company_name}
                        onChange={(e) => onUpdate({ company_name: e.target.value })}
                    />
                </div>

                {/* DBA Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has-dba"
                            checked={has_dba}
                            onCheckedChange={(val) => onUpdate({ has_dba: val })}
                        />
                        <Label htmlFor="has-dba">Doing Business As (DBA) - Optional</Label>
                    </div>

                    {has_dba && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="dba-name">Trade Name</Label>
                            <Input
                                id="dba-name"
                                placeholder="e.g. Acme Labs"
                                value={dba_name || ""}
                                onChange={(e) => onUpdate({ dba_name: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Address Section */}
                {(company_name.length > 2 || addresses.length > 0) && (
                    <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Legal Business Address</h3>
                            <Button variant="outline" size="sm" onClick={() => { setEditingAddress(undefined); setIsAddressModalOpen(true); }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Address
                            </Button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="border border-dashed rounded-lg p-8 text-center bg-muted/10">
                                <p className="text-sm text-muted-foreground mb-4">No addresses added yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map((addr: any) => (
                                    <AddressCard
                                        key={addr.id}
                                        address={addr}
                                        onEdit={(a) => { setEditingAddress(a); setIsAddressModalOpen(true); }}
                                        onDelete={(id) => handleAddressDelete(id)}
                                    />
                                ))}
                            </div>
                        )}

                        <AddressForm
                            entityId={data.id || "temp"}
                            open={isAddressModalOpen}
                            onOpenChange={setIsAddressModalOpen}
                            initialData={editingAddress}
                            onSuccess={() => { }}
                            onLocalSave={handleAddressSave}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
