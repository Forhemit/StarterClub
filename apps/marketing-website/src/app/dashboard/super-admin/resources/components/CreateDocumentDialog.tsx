"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DocumentForm } from "./DocumentForm";
import { useState } from "react";
import { createResourceAction } from "../../actions";
import { useToast } from "@/hooks/use-toast";

interface CreateDocumentDialogProps {
    onSuccess: () => void;
}

export function CreateDocumentDialog({ onSuccess }: CreateDocumentDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (values: any) => {
        const res = await createResourceAction(values);
        if (res.success) {
            toast({ title: "Success", description: "Document created successfully." });
            setOpen(false);
            onSuccess();
        } else {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild suppressHydrationWarning>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Document</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" suppressHydrationWarning>
                <DialogHeader>
                    <DialogTitle>Create Document</DialogTitle>
                    <DialogDescription>
                        Add a new resource, policy, or guide to the portal.
                    </DialogDescription>
                </DialogHeader>
                <DocumentForm onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    );
}
