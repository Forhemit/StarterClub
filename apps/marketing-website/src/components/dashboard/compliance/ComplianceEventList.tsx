"use client";

import { useState } from "react";
import { ComplianceEvent } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComplianceEventListProps {
    events: ComplianceEvent[];
    onEventsChange: (events: ComplianceEvent[]) => void;
    category: ComplianceEvent['category'];
    title: string;
    description: string;
    showJurisdiction?: boolean;
    titlePresets?: string[];
}

export function ComplianceEventList({ events, onEventsChange, category, title, description, showJurisdiction = false, titlePresets }: ComplianceEventListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<ComplianceEvent>>({
        title: "",
        due_date: undefined, // Type is string | Date | undefined
        status: "pending",
        jurisdiction: "",
        notes: ""
    });

    // For handling the "Other" logic in dropdown
    const [useCustomTitle, setUseCustomTitle] = useState(false);

    const handleEdit = (event: ComplianceEvent) => {
        setFormData({ ...event });
        setEditingId(event.id);

        // Determine if we should show custom input or preset
        if (titlePresets) {
            if (titlePresets.includes(event.title)) {
                setUseCustomTitle(false);
            } else {
                setUseCustomTitle(true);
            }
        }

        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        onEventsChange(events.filter(e => e.id !== id));
    };

    const handleSave = () => {
        if (!formData.title || !formData.due_date) return;

        const newEvent: ComplianceEvent = {
            id: editingId || `temp-${Date.now()}`,
            category: category,
            title: formData.title,
            due_date: formData.due_date,
            description: formData.description,
            status: formData.status as any || 'pending',
            jurisdiction: formData.jurisdiction,
            notes: formData.notes
        };

        if (editingId) {
            onEventsChange(events.map(e => e.id === editingId ? newEvent : e));
        } else {
            onEventsChange([...events, newEvent]);
        }

        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({ title: "", status: "pending", jurisdiction: "", notes: "" });
        setUseCustomTitle(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
            case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
            case 'ignored': return <Badge variant="secondary">Ignored</Badge>;
            default: return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    {/* Title handled by parent usually, but props provided just in case of simple usage */}
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button onClick={() => {
                    setEditingId(null);
                    setFormData({ title: "", status: "pending", jurisdiction: "", notes: "" });
                    setUseCustomTitle(false);
                    setIsDialogOpen(true);
                }} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Entry
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Entry" : "Add New Entry"}</DialogTitle>
                        <DialogDescription>
                            {title} details will be tracked in your compliance calendar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title / Type</Label>

                            {titlePresets ? (
                                <div className="space-y-2">
                                    <Select
                                        value={useCustomTitle ? "Other" : (formData.title || "")}
                                        onValueChange={(val) => {
                                            if (val === "Other") {
                                                setUseCustomTitle(true);
                                                setFormData({ ...formData, title: "" });
                                            } else {
                                                setUseCustomTitle(false);
                                                setFormData({ ...formData, title: val });
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {titlePresets.map(preset => (
                                                <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {useCustomTitle && (
                                        <Input
                                            autoFocus
                                            placeholder="Enter custom title..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    )}
                                </div>
                            ) : (
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Annual Report, Sales Tax Filing"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !formData.due_date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.due_date ? new Date(formData.due_date) : undefined}
                                            onSelect={(date) => setFormData({ ...formData, due_date: date ? format(date, "yyyy-MM-dd") : undefined })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                        <SelectItem value="ignored">Ignored/Waived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {showJurisdiction && (
                            <div className="grid gap-2">
                                <Label htmlFor="jurisdiction">Jurisdiction (State/City)</Label>
                                <Input
                                    id="jurisdiction"
                                    value={formData.jurisdiction}
                                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                                    placeholder="e.g., California, Federal"
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional details..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={!formData.title || !formData.due_date}>Save Entry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {events.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50">
                    <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-medium">No items tracked yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Add your first {title.toLowerCase()} entry using the button above.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Item</TableHead>
                                {showJurisdiction && <TableHead>Jurisdiction</TableHead>}
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div className="font-medium">{event.title}</div>
                                        {event.notes && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{event.notes}</div>}
                                    </TableCell>
                                    {showJurisdiction && <TableCell>{event.jurisdiction || "—"}</TableCell>}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                                            {format(new Date(event.due_date), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(event)} className="h-8 w-8">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
