'use client'

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removed unused import
import {
    getModuleItemsAction,
    addModuleItemAction,
    removeModuleItemAction,
    getChecklistItemsAction,
    createChecklistItemAction
} from '@/app/actions/marketplace';
import { Plus, Trash, Search, GripVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Assuming Tabs exist in UI, if not I'll just use conditional rendering.
// I saw tabs.tsx in marketing-website but not super-admin. 
// I'll skip Tabs component and use simple state for tabs to be safe.

export function ModuleChecklistEditor({ moduleId }: { moduleId: string }) {
    const [items, setItems] = useState<any[]>([]);
    const [availableItems, setAvailableItems] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'current' | 'add' | 'create'>('current');
    const [loading, setLoading] = useState(false);

    // Create new item state
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');

    const fetchModuleItems = useCallback(async () => {
        setLoading(true);
        const res = await getModuleItemsAction(moduleId);
        if (res.success) setItems(res.data || []);
        setLoading(false);
    }, [moduleId]);

    const fetchAvailableItems = useCallback(async () => {
        const res = await getChecklistItemsAction(search);
        if (res.success) setAvailableItems(res.data || []);
    }, [search]);

    useEffect(() => {
        fetchModuleItems();
    }, [fetchModuleItems]);

    useEffect(() => {
        if (activeTab === 'add') {
            fetchAvailableItems();
        }
    }, [activeTab, search, fetchAvailableItems]);

    const handleAddItem = async (itemId: string) => {
        await addModuleItemAction(moduleId, itemId);
        fetchModuleItems();
        // Optional: show toast
        setActiveTab('current');
    };

    const handleRemoveItem = async (moduleItemId: string) => {
        if (!confirm('Remove this item from the module?')) return;
        await removeModuleItemAction(moduleItemId);
        fetchModuleItems();
    };

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createChecklistItemAction({
            title: newItemTitle,
            description: newItemDescription,
            // category_id: ... could add select, default null
        });

        if (res.success) {
            // Auto add to module
            await addModuleItemAction(moduleId, res.data.id);
            setNewItemTitle('');
            setNewItemDescription('');
            fetchModuleItems();
            setActiveTab('current');
        } else {
            alert('Error creating item: ' + res.error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b">
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'current' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('current')}
                >
                    Current Items ({items.length})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'add' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Existing
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'create' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create New
                </button>
            </div>

            {activeTab === 'current' && (
                <div className="space-y-2">
                    {items.length === 0 && <div className="text-muted-foreground text-sm italic">No items in this module yet.</div>}
                    {items.map((mItem) => (
                        <Card key={mItem.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                <div>
                                    <div className="font-semibold">{mItem.item.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{mItem.item.description}</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(mItem.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'add' && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search existing items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="secondary" onClick={() => fetchAvailableItems()}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {availableItems.map((item) => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-xs text-muted-foreground">{item.description}</div>
                                </div>
                                <Button size="sm" onClick={() => handleAddItem(item.id)}>
                                    Add
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'create' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Checklist Item</CardTitle>
                        <CardDescription>Creates a globally available item and adds it to this module.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateItem} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                    placeholder="e.g. Register for EIN"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={newItemDescription}
                                    onChange={(e) => setNewItemDescription(e.target.value)}
                                    placeholder="Instructions for the user..."
                                />
                            </div>
                            <Button type="submit">Create & Add</Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
