'use client'

import { useState } from 'react';
import { Info, ExternalLink, CheckCircle2, Circle, Clock, ShieldCheck, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface ChecklistItemType {
    id: string;
    title: string;
    description: string | null;
    category_id: string;
    metadata_schema: any; // { fields: string[] }
    category?: { name: string };
    module_items?: { module_id: string }[];
}

interface ChecklistItemProps {
    item: ChecklistItemType;
    status: string; // 'not_started', 'in_progress', 'complete'
    onToggle: (id: string, newStatus: 'complete' | 'not_started') => void;
    metadata?: any;
    onUpdateMetadata: (id: string, metadata: any) => Promise<void>;
    verification?: {
        verified_at: string | null;
        verified_by: string | null;
    }
}

export function ChecklistItem({ item, status, onToggle, metadata, onUpdateMetadata, verification }: ChecklistItemProps) {
    const isCompleted = status === 'complete';
    const isInProgress = status === 'in_progress';
    const isVerified = !!verification?.verified_at;

    const [isExpanded, setIsExpanded] = useState(false);
    const [localMetadata, setLocalMetadata] = useState(metadata || {});
    const [isSaving, setIsSaving] = useState(false);

    const fields = item.metadata_schema?.fields || [];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdateMetadata(item.id, localMetadata);
            toast.success("Data updated in Vault");
            setIsExpanded(false);
        } catch (error) {
            toast.error("Failed to save data");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={cn(
            "group flex flex-col transition-colors border-b border-slate-100 last:border-0",
            isCompleted && "bg-slate-50/30"
        )}>
            <div className="flex items-start gap-4 p-4">
                <div className="pt-0.5">
                    <Checkbox
                        id={item.id}
                        checked={isCompleted}
                        onCheckedChange={(checked) => {
                            onToggle(item.id, checked ? 'complete' : 'not_started');
                        }}
                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <label
                            htmlFor={item.id}
                            className={cn(
                                "text-sm font-semibold leading-none cursor-pointer select-none",
                                isCompleted ? "text-slate-400 line-through" : "text-slate-700"
                            )}
                        >
                            {item.title}
                        </label>

                        {item.description && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400 hover:text-blue-500">
                                            <Info className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[250px] text-xs">
                                        <p>{item.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {isVerified && (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-1.5 h-4 gap-1 text-[9px] uppercase tracking-tighter">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                Verified
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                            "text-[9px] uppercase px-1.5 py-0 h-4 border-none font-bold",
                            isCompleted ? "bg-green-100 text-green-700" :
                                isInProgress ? "bg-amber-100 text-amber-700" :
                                    "bg-slate-100 text-slate-500"
                        )}>
                            {status.replace('_', ' ')}
                        </Badge>

                        {fields.length > 0 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-medium"
                            >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {Object.keys(metadata || {}).length > 0 ? 'Edit Details' : 'Add Details'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Future space for partner links */}
                </div>
            </div>

            {isExpanded && (
                <div className="px-12 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-50/50 rounded-lg border border-slate-100 p-4 space-y-4">
                        <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Master Data Entry</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field: string) => (
                                <div key={field} className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-500 capitalize">{field.replace('_', ' ')}</label>
                                    <Input
                                        value={localMetadata[field] || ''}
                                        onChange={(e) => setLocalMetadata({ ...localMetadata, [field]: e.target.value })}
                                        className="h-8 text-xs bg-white"
                                        placeholder={`Enter ${field.replace('_', ' ')}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Standard Provenance Section */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">Data Source Info</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                                <Input
                                    value={localMetadata.source_website || ''}
                                    onChange={(e) => setLocalMetadata({ ...localMetadata, source_website: e.target.value })}
                                    className="h-7 text-[10px] bg-white"
                                    placeholder="Website Source"
                                />
                                <Input
                                    value={localMetadata.source_phone || ''}
                                    onChange={(e) => setLocalMetadata({ ...localMetadata, source_phone: e.target.value })}
                                    className="h-7 text-[10px] bg-white"
                                    placeholder="Phone Source"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                size="sm"
                                className="h-8 text-xs gap-2"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save className="h-3.5 w-3.5" />
                                Save to Vault
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
