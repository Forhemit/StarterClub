'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { createModuleAction, updateModuleAction } from '@/app/actions/marketplace';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ModuleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function ModuleForm({ initialData, isEditing = false }: ModuleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        module_type: initialData?.module_type || 'industry',
        version: initialData?.version || '1.0.0',
        price_monthly: initialData?.price_monthly || 0,
        is_public: initialData?.is_public ?? true,
        icon: initialData?.icon || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = isEditing
                ? await updateModuleAction(initialData.id, formData)
                : await createModuleAction(formData);

            if (result.success) {
                if (!isEditing) {
                    router.push('/marketplace');
                } else {
                    router.refresh();
                }
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Module Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Retail Trade"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Brief description of the module..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="module_type">Type</Label>
                        <select
                            id="module_type"
                            name="module_type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.module_type}
                            onChange={handleChange}
                        >
                            <option value="industry">Industry (Sector)</option>
                            <option value="function">Function (Cross-cutting)</option>
                            <option value="submodule">Sub-module</option>
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                            id="version"
                            name="version"
                            placeholder="1.0.0"
                            value={formData.version}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price_monthly">Monthly Price ($)</Label>
                        <Input
                            id="price_monthly"
                            name="price_monthly"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price_monthly}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon Name (Lucide)</Label>
                        <Input
                            id="icon"
                            name="icon"
                            placeholder="e.g. building"
                            value={formData.icon}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_public"
                        name="is_public"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.is_public}
                        onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    />
                    <Label htmlFor="is_public">Publicly Available</Label>
                </div>
            </div>

            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Module'}
            </Button>
        </form>
    );
}
