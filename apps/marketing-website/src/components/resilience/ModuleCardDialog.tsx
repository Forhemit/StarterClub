"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { completeCard } from "@/actions/resilience";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface ModuleCardDialogProps {
    card: any;
    initialStatus: "pending" | "in_progress" | "completed";
    children: React.ReactNode;
}

export function ModuleCardDialog({ card, initialStatus, children }: ModuleCardDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checklist, setChecklist] = useState<string[]>([]); // simplified for now

    // Parse checklist items if they come as specific structure
    const checklistItems = Array.isArray(card.checklist_items) ? card.checklist_items : [];

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const result = await completeCard(card.id, "completed");
            if (result.error) {
                toast.error(result.error);
            } else {
                setStatus("completed");
                toast.success("Task Completed");
                setIsOpen(false);
            }
        } catch (e) {
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevert = async () => {
        setIsSubmitting(true);
        try {
            const result = await completeCard(card.id, "in_progress"); // Revert to in-progress or pending
            if (result.error) {
                toast.error(result.error);
            } else {
                setStatus("in_progress");
                toast.success("Task marked as in progress.");
            }
        } catch (e) {
            // err
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{card.weight} pts</Badge>
                        {status === 'completed' && <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>}
                    </div>
                    <DialogTitle className="text-xl">{card.title}</DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        {card.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Definition of Done */}
                    {card.definition_of_done && (
                        <div className="bg-muted/50 p-4 rounded-md border">
                            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Definition of Done</h4>
                            <p className="text-sm">{card.definition_of_done}</p>
                        </div>
                    )}

                    {/* Checklist */}
                    {checklistItems.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium">Checklist</h4>
                            {checklistItems.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-start space-x-2">
                                    <Checkbox id={`check-${idx}`} />
                                    <Label htmlFor={`check-${idx}`} className="text-sm font-normal pt-0.5 leading-tight cursor-pointer">
                                        {typeof item === 'string' ? item : item.label || JSON.stringify(item)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Evidence / Notes Placeholder */}
                    {/* <div className="space-y-2">
                <Label>Notes / Evidence Link</Label>
                <Textarea placeholder="Add a link to the completed document or notes..." className="resize-none" />
            </div> */}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {status === 'completed' ? (
                        <Button variant="outline" onClick={handleRevert} disabled={isSubmitting}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Reopen Task
                        </Button>
                    ) : (
                        <div className="flex w-full justify-between items-center">
                            <span className="text-xs text-muted-foreground">Check all items to complete</span>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button onClick={handleComplete} disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Mark as Complete"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
