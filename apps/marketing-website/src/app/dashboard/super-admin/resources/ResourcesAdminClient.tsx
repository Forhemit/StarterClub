"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { Trash, Plus } from "lucide-react";
import { createResourceAction, deleteResourceAction } from "../actions";

export default function ResourcesAdminClient({ initialResources }: { initialResources: any[] }) {
    const [resources, setResources] = useState(initialResources);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form State
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("Shared");
    const [url, setUrl] = useState("");

    const handleCreate = async () => {
        setLoading(true);
        try {
            const { success, data, error } = await createResourceAction({
                title,
                description: desc,
                track: category.toLowerCase(),
                file_url: url,
                type: 'pdf', // Defaulting for now
                visibility: 'partner'
            });
            if (!success) throw new Error(error);
            setResources(prev => [data, ...prev]);
            toast.success("Resource created!");
            setTitle(""); setDesc(""); setUrl("");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        try {
            const { success, error } = await deleteResourceAction(id);
            if (!success) throw new Error(error);
            setResources(prev => prev.filter(r => r.id !== id));
            toast.success("Deleted!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Add New Resource</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input value={url} onChange={e => setUrl(e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Input value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={category} onChange={e => setCategory(e.target.value)}>
                            <option>Shared</option>
                            <option>Banks</option>
                            <option>Insurance</option>
                            <option>Hardware</option>
                            <option>SaaS</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleCreate} disabled={loading || !title || !url} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Add Resource
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4">
                {resources.map(r => (
                    <div key={r.id} className="flex justify-between items-center p-4 border rounded bg-white">
                        <div>
                            <div className="font-bold">{r.title}</div>
                            <div className="text-sm text-gray-500">{r.track} • {r.file_url}</div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} disabled={loading}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
