"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DocumentForm } from "./DocumentForm";
import { updateResourceAction } from "../../actions";
import { useToast } from "@/hooks/use-toast";

interface EditDocumentDialogProps {
    document: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditDocumentDialog({ document, open, onOpenChange, onSuccess }: EditDocumentDialogProps) {
    const { toast } = useToast();

    const handleSubmit = async (values: any) => {
        if (!document) return;
        const res = await updateResourceAction(document.id, values);
        if (res.success) {
            toast({ title: "Success", description: "Document updated successfully." });
            onOpenChange(false);
            onSuccess();
        } else {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" suppressHydrationWarning>
                <DialogHeader>
                    <DialogTitle>Edit Document</DialogTitle>
                    <DialogDescription>
                        Make changes to {document?.title}.
                    </DialogDescription>
                </DialogHeader>
                {document && (
                    <DocumentForm
                        defaultValues={{
                            ...document,
                            // Ensure enums match exact values or undefined
                            doc_type: document.doc_type as any,
                            track: document.track as any,
                            status: document.status as any,
                        }}
                        onSubmit={handleSubmit}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
