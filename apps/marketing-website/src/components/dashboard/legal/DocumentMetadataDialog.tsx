"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface DocumentMetadataDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: File | null;
    documentType: string;
    onConfirm: (metadata: { displayName: string; expirationDate: string | null }) => Promise<void>;
}

export function DocumentMetadataDialog({ open, onOpenChange, file, documentType, onConfirm }: DocumentMetadataDialogProps) {
    const [displayName, setDisplayName] = useState("");
    const [hasExpiration, setHasExpiration] = useState(false);
    const [expirationDate, setExpirationDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (file) {
            // Default display name to filename without extension
            setDisplayName(file.name.replace(/\.[^/.]+$/, ""));
        }
    }, [file]);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm({
                displayName,
                expirationDate: hasExpiration ? expirationDate : null
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Document Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Input value={documentType} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter document name"
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Start Expiration Tracking?</Label>
                            <p className="text-xs text-muted-foreground">
                                Enable if this document expires (e.g. certificates)
                            </p>
                        </div>
                        <Switch
                            checked={hasExpiration}
                            onCheckedChange={setHasExpiration}
                        />
                    </div>

                    {hasExpiration && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Expiration Date</Label>
                            <Input
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={isSubmitting || !displayName || (hasExpiration && !expirationDate)}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Upload Document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
