'use client'

import { useState, useMemo } from 'react';
import { toggleChecklistItem, updateItemMetadata } from '@/app/actions/checklist';
import { ChecklistItem, ChecklistItemType } from './ChecklistItem';
import { ModuleSelector } from './ModuleSelector';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistContainerProps {
    initialData: {
        business: any;
        items: ChecklistItemType[];
        modules: any[];
        categories: any[];
        statuses: any[];
        progress: any[];
        activeModuleIds: string[];
        stagedModuleIds: string[];
    };
}

export function ChecklistContainer({ initialData }: ChecklistContainerProps) {
    // Use database-originated active modules, and always include "Core Foundation"
    const coreModuleId = initialData.modules.find(m => m.name === 'Core Foundation')?.id;
    const initialActive = [...initialData.activeModuleIds];
    if (coreModuleId && !initialActive.includes(coreModuleId)) {
        initialActive.push(coreModuleId);
    }

    const [activeModuleIds, setActiveModuleIds] = useState<string[]>(initialActive);
    const [progress, setProgress] = useState(initialData.progress);

    // Derive item statuses for the UI
    const itemStatusMap = useMemo(() => {
        const map = new Map<string, { status: string; metadata: any; verified_at: string | null }>();
        progress.forEach((p: any) => {
            map.set(p.item_id, {
                status: p.status?.name || 'not_started',
                metadata: p.metadata,
                verified_at: p.verified_at
            });
        });
        return map;
    }, [progress]);

    // Filter items based on active modules
    const filteredItems = useMemo(() => {
        return initialData.items.filter(item =>
            item.module_items?.some((mi: any) => activeModuleIds.includes(mi.module_id))
        );
    }, [initialData.items, activeModuleIds]);

    // Calculate progress
    const stats = useMemo(() => {
        const total = filteredItems.length;
        const completed = filteredItems.filter(item =>
            itemStatusMap.get(item.id)?.status === 'complete'
        ).length;
        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }, [filteredItems, itemStatusMap]);

    const handleToggle = async (itemId: string, newStatus: 'complete' | 'not_started') => {
        try {
            // Optimistic update
            const existing = progress.find(p => p.item_id === itemId);
            const newProgress = existing
                ? progress.map(p => p.item_id === itemId ? { ...p, status: { name: newStatus } } : p)
                : [...progress, { item_id: itemId, status: { name: newStatus }, metadata: {} }];

            setProgress(newProgress);

            await toggleChecklistItem(initialData.business.id, itemId, newStatus);

            if (newStatus === 'complete' && stats.completed + 1 === stats.total) {
                toast.success("Foundation Complete! 🏆", {
                    description: "Your business is now fully established.",
                    duration: 5000,
                });
            }
        } catch (error) {
            toast.error("Failed to update task");
            setProgress(progress); // Rollback
        }
    };

    const handleUpdateMetadata = async (itemId: string, metadata: any) => {
        try {
            // Optimistic update
            const existing = progress.find(p => p.item_id === itemId);
            const newProgress = existing
                ? progress.map(p => p.item_id === itemId ? { ...p, metadata } : p)
                : [...progress, { item_id: itemId, status: { name: 'in_progress' }, metadata }];

            setProgress(newProgress);
            await updateItemMetadata(initialData.business.id, itemId, metadata);
        } catch (error) {
            toast.error("Failed to sync metadata");
            setProgress(progress); // Rollback
            throw error;
        }
    };

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, ChecklistItemType[]> = {};
        filteredItems.forEach(item => {
            const catName = item.category?.name || 'Other';
            if (!groups[catName]) groups[catName] = [];
            groups[catName].push(item);
        });
        return groups;
    }, [filteredItems]);

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4">
            {/* Sidebar: Progress & Modules */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{initialData.business.business_name}</h3>
                            <p className="text-xs text-slate-500">Business Foundation</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 font-medium">Overall Progress</span>
                                <span className="text-blue-600 font-bold">{stats.percentage}%</span>
                            </div>
                            <Progress value={stats.percentage} className="h-2" />
                        </div>
                        <p className="text-[10px] text-slate-400">
                            {stats.completed} of {stats.total} items completed
                        </p>
                    </div>
                </div>

                <ModuleSelector
                    modules={initialData.modules.filter((m: any) =>
                        m.name !== 'Core Foundation' && initialData.activeModuleIds.includes(m.id)
                    )}
                    activeModuleIds={activeModuleIds}
                    onToggleModule={(id) => {
                        setActiveModuleIds(prev =>
                            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
                        );
                    }}
                />
            </div>

            {/* Main Checklist */}
            <div className="flex-1 space-y-6">
                {stats.percentage === 100 && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                            <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-1">Foundation Complete!</h2>
                            <p className="text-blue-100 text-sm italic">
                                "The strongest foundations support the tallest dreams."
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {Object.entries(groupedItems).length > 0 ? (
                            Object.entries(groupedItems).map(([catName, items]) => (
                                <div key={catName}>
                                    <div className="px-6 py-2 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {catName}
                                    </div>
                                    {items.map(item => {
                                        const statusData = itemStatusMap.get(item.id);
                                        return (
                                            <ChecklistItem
                                                key={item.id}
                                                item={item}
                                                status={statusData?.status || 'not_started'}
                                                metadata={statusData?.metadata}
                                                onToggle={handleToggle}
                                                onUpdateMetadata={handleUpdateMetadata}
                                                verification={{
                                                    verified_at: statusData?.verified_at || null,
                                                    verified_by: null // In future we'd link this
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400 italic">
                                No items found for the selected modules.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
