"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ResourceTable, ResourceRow, ResourceCell } from "@/components/admin/ResourceTable";
import { createApiKeyAction, revokeApiKeyAction } from "../actions";
import { useToast } from "@/context/ToastContext";
import { Plus, Trash2, Key, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ApiKeysClient({ initialKeys }: { initialKeys: any[] }) {
    const [keys, setKeys] = useState(initialKeys);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [newKey, setNewKey] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCreate = async () => {
        setLoading(true);
        try {
            const { success, data, error } = await createApiKeyAction(name);
            if (!success) throw new Error(error);

            setNewKey(data.key);
            // Optimistically update list (though we don't have the full DB row yet ideally, 
            // but we can fake it or refresh. Ideally we just append what we have)
            // The action returned { key, id }. We need the rest of the fields to render nicely.
            // For now, reload the page or just append a partial object.
            // Let's just append a partial and basic render.
            setKeys(prev => [{
                id: data.id,
                name: name,
                key_hash: '...',
                status: 'active',
                created_at: new Date().toISOString(),
                partner_orgs: null
            }, ...prev]);

            toast.success("API Key Created");
            setName("");
            // Don't close sheet yet, showing key
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this key? apps using it will break.")) return;
        setLoading(true);
        try {
            const { success, error } = await revokeApiKeyAction(id);
            if (!success) throw new Error(error);
            setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
            toast.success("Key Revoked");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Sheet open={open} onOpenChange={(val) => {
                    if (!val) setNewKey(null); // Clear key on close
                    setOpen(val);
                }}>
                    <SheetTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Generate Key</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Generate API Key</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6 mt-6">
                            {!newKey ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Key Name</Label>
                                        <Input
                                            placeholder="e.g. My Integration"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleCreate} disabled={loading || !name} className="w-full">
                                        {loading ? "Generating..." : "Generate Key"}
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4 bg-green-50 p-4 rounded border border-green-200">
                                    <div className="flex items-center text-green-800 font-bold mb-2">
                                        <Key className="mr-2 h-4 w-4" /> Key Generated!
                                    </div>
                                    <p className="text-sm text-green-700">
                                        Copy this key now. You won't be able to see it again.
                                    </p>
                                    <div className="flex space-x-2">
                                        <Input className="font-mono bg-white" value={newKey} readOnly />
                                        <Button size="icon" variant="outline" onClick={() => {
                                            navigator.clipboard.writeText(newKey);
                                            toast.success("Copied!");
                                        }}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                                        Done
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <ResourceTable headers={["Name", "Org", "Status", "Created", "Actions"]}>
                {keys.map(key => (
                    <ResourceRow key={key.id} className={key.status === 'revoked' ? 'opacity-50' : ''}>
                        <ResourceCell>
                            <div className="font-medium">{key.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">ID: {key.id}</div>
                        </ResourceCell>
                        <ResourceCell>
                            {key.partner_orgs?.name || "-"}
                        </ResourceCell>
                        <ResourceCell>
                            <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                                {key.status}
                            </Badge>
                        </ResourceCell>
                        <ResourceCell>
                            {new Date(key.created_at).toLocaleDateString()}
                        </ResourceCell>
                        <ResourceCell>
                            {key.status === 'active' && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRevoke(key.id)}
                                    disabled={loading}
                                >
                                    Revoke
                                </Button>
                            )}
                        </ResourceCell>
                    </ResourceRow>
                ))}
                {keys.length === 0 && (
                    <ResourceRow>
                        <ResourceCell className="text-center text-muted-foreground p-8" colSpan={5}>
                            No API Keys found.
                        </ResourceCell>
                    </ResourceRow>
                )}
            </ResourceTable>
        </>
    );
}
