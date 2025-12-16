"use client";

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
import { deleteResourceAction } from "../../actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DeleteDocumentDialogProps {
    document: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function DeleteDocumentDialog({ document, open, onOpenChange, onSuccess }: DeleteDocumentDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!document) return;
        setLoading(true);
        try {
            const res = await deleteResourceAction(document.id);
            if (res.success) {
                toast({ title: "Deleted", description: "Document removed successfully." });
                onOpenChange(false);
                onSuccess();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent suppressHydrationWarning>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document
                        "{document?.title}" and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
