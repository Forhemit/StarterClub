import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createOrUpdateLegalEntity, getLegalEntity } from "@/actions/legal-vault";
import { getEntityAddresses, deleteAddress, AddressRecord } from "@/actions/addresses";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { toast } from "sonner";
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
import { Skeleton } from "@/components/ui/skeleton";


interface Step1Props {
    entityId: string | null;
    onSave: (id: string) => void;
}

export function Step1CompanyProfile({ entityId, onSave }: Step1Props) {
    const [companyName, setCompanyName] = useState("");
    const [dbaName, setDbaName] = useState("");
    const [hasDba, setHasDba] = useState(false);

    // Address List State
    const [addresses, setAddresses] = useState<AddressRecord[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressRecord | undefined>(undefined);

    // Progressive Reveal State
    const [showAddress, setShowAddress] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);

    const loadAddresses = useCallback(async () => {
        if (!entityId) return;
        setLoadingAddresses(true);
        try {
            const data = await getEntityAddresses(entityId);
            setAddresses(data);
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoadingAddresses(false);
        }
    }, [entityId]);

    // Initial Load
    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const data = await getLegalEntity();
            if (!mounted) return;

            if (data) {
                if (data.company_name) setCompanyName(data.company_name);
                if (data.dba_name) {
                    setDbaName(data.dba_name);
                    setHasDba(true);
                }

                // Show address if data exists or name is populated
                if (data.company_name && data.company_name.length > 2) setShowAddress(true);

                // Only call onSave if we don't already have an entityId (first load)
                if (data.id && !entityId) {
                    onSave(data.id);
                }
            }
            setIsLoaded(true);
        }
        loadData();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load addresses when entityId is available
    useEffect(() => {
        if (entityId) {
            loadAddresses();
        }
    }, [entityId, loadAddresses]);

    // Progressive Reveal Effect
    useEffect(() => {
        if (companyName.length > 2) {
            setShowAddress(true);
        } else {
            if (companyName.length === 0) setShowAddress(false);
        }
    }, [companyName]);

    // Auto-Save Effect
    useEffect(() => {
        if (!isLoaded) return;

        const timeoutId = setTimeout(async () => {
            // ... same auto-save for company name ...
            // We removed address fields from here, just saving name/dba
            try {
                const result = await createOrUpdateLegalEntity({
                    id: entityId || undefined,
                    company_name: companyName,
                    dba_name: hasDba ? dbaName : undefined,
                    organization_type: "",
                    primary_state: "",
                });

                if (result?.id && onSave && result.id !== entityId) {
                    onSave(result.id);
                }
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [companyName, dbaName, hasDba, entityId, isLoaded]); // Removed onSave to prevent loops

    const handleDeleteAddress = async (id: string) => {
        try {
            await deleteAddress(id);
            toast.success("Address deleted");
            loadAddresses();
            if (entityId) onSave(entityId);
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleAddressSuccess = () => {
        loadAddresses();
        if (entityId) onSave(entityId);
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
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                {/* DBA Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has-dba"
                            checked={hasDba}
                            onCheckedChange={setHasDba}
                        />
                        <Label htmlFor="has-dba">Doing Business As (DBA) - Optional</Label>
                    </div>

                    {hasDba && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="dba-name">Trade Name</Label>
                            <Input
                                id="dba-name"
                                placeholder="e.g. Acme Labs"
                                value={dbaName}
                                onChange={(e) => setDbaName(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Address Section */}
                {showAddress && (
                    <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Legal Business Address</h3>
                            <Button variant="outline" size="sm" onClick={() => { setEditingAddress(undefined); setIsAddressModalOpen(true); }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Address
                            </Button>
                        </div>

                        {loadingAddresses ? (
                            <div className="grid gap-4">
                                <Skeleton className="h-[120px] w-full rounded-xl" />
                                <Skeleton className="h-[120px] w-full rounded-xl" />
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="border border-dashed rounded-lg p-8 text-center bg-muted/10">
                                <p className="text-sm text-muted-foreground mb-4">No addresses added yet.</p>
                                <Button size="sm" onClick={() => { setEditingAddress(undefined); setIsAddressModalOpen(true); }}>
                                    Add Legal Address
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map((addr) => (
                                    <AddressCard
                                        key={addr.id}
                                        address={addr}
                                        onEdit={(a) => { setEditingAddress(a); setIsAddressModalOpen(true); }}
                                        onDelete={(id) => handleDeleteAddress(id)}
                                    />
                                ))}
                            </div>
                        )}

                        <AddressForm
                            entityId={entityId || ""}
                            open={isAddressModalOpen}
                            onOpenChange={setIsAddressModalOpen}
                            initialData={editingAddress}
                            onSuccess={handleAddressSuccess}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
