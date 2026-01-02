"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createOrUpdateContact, ContactRecord, getDistinctContactTypes } from "@/actions/contacts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatPhone } from "@/lib/utils";

// Schema
// We allow any string now, but if it's new it comes from the custom input
const contactSchema = z.object({
    contact_type: z.string().min(1, "Contact type is required"),
    custom_type: z.string().optional(),
    phone: z.string().min(10, "Phone number required"),
    email: z.string().email("Invalid email address"),
});

interface ContactFormProps {
    entityId: string;
    initialData?: ContactRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    onLocalSave?: (contact: any) => void;
}

export function ContactForm({ entityId, initialData, open, onOpenChange, onSuccess, onLocalSave }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [showCustomType, setShowCustomType] = useState(false);

    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            contact_type: 'Legal',
            custom_type: '',
            phone: '',
            email: '',
        }
    });

    // Load types
    useEffect(() => {
        getDistinctContactTypes().then(setAvailableTypes);
    }, [open]);

    useEffect(() => {
        if (initialData) {
            form.reset({
                contact_type: initialData.contact_type,
                custom_type: '',
                phone: initialData.phone || '',
                email: initialData.email || '',
            });
            setShowCustomType(false);
        } else {
            form.reset({
                contact_type: 'Legal',
                custom_type: '',
                phone: '',
                email: '',
            });
            setShowCustomType(false);
        }
    }, [initialData, form, open]);

    const watchType = form.watch("contact_type");
    useEffect(() => {
        if (watchType === 'Other') {
            setShowCustomType(true);
        } else {
            setShowCustomType(false);
        }
    }, [watchType]);

    const onSubmit = async (values: z.infer<typeof contactSchema>) => {
        setIsSubmitting(true);
        try {
            // If "Other" is selected, use the custom_type value
            const finalType = values.contact_type === 'Other' ? values.custom_type : values.contact_type;

            if (!finalType) {
                form.setError('custom_type', { message: "Please specify the contact type" });
                setIsSubmitting(false);
                return;
            }

            if (onLocalSave) {
                onLocalSave({
                    id: initialData?.id || crypto.randomUUID(),
                    entity_id: entityId,
                    ...values,
                    contact_type: finalType
                });
                toast.success(initialData ? "Contact updated" : "Contact added");
                onSuccess();
                onOpenChange(false);
                return;
            }

            await createOrUpdateContact({
                id: initialData?.id,
                entity_id: entityId,
                is_primary: false,
                ...values,
                contact_type: finalType as any
            });
            toast.success(initialData ? "Contact updated" : "Contact added");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to save contact");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Contact" : "Add Contact Information"}</DialogTitle>
                    <DialogDescription>
                        Add a new contact record for this entity.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="contact_type">Contact Type</Label>
                        <Select
                            onValueChange={(val) => form.setValue("contact_type", val)}
                            value={form.watch("contact_type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTypes.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {showCustomType && (
                        <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="custom_type">Specify Type</Label>
                            <Input
                                id="custom_type"
                                placeholder="e.g. Warehouse"
                                {...form.register("custom_type")}
                            />
                            {form.formState.errors.custom_type && <p className="text-xs text-destructive">{form.formState.errors.custom_type.message}</p>}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                {...form.register("phone", {
                                    onChange: (e) => {
                                        const formatted = formatPhone(e.target.value);
                                        form.setValue("phone", formatted);
                                    }
                                })}
                                placeholder="(555) 123-4567"
                            />
                            {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...form.register("email")} placeholder="email@example.com" />
                            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Contact
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
}
