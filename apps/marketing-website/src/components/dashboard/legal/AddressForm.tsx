"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createOrUpdateAddress, AddressRecord, getDistinctAddressTypes } from "@/actions/addresses";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const US_STATES = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "District of Columbia" },
];

const addressSchema = z.object({
    address_type: z.string().min(1, "Type is required"),
    custom_type: z.string().optional(),
    line1: z.string().min(1, "Street address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zip: z.string().min(5, "Zip code is required"),
});

interface AddressFormProps {
    entityId: string;
    initialData?: AddressRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddressForm({ entityId, initialData, open, onOpenChange, onSuccess }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [showCustomType, setShowCustomType] = useState(false);

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address_type: 'Legal',
            custom_type: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: '',
        }
    });

    // Load types
    useEffect(() => {
        getDistinctAddressTypes().then(setAvailableTypes);
    }, [open]);

    useEffect(() => {
        if (initialData) {
            form.reset({
                address_type: initialData.address_type, // If it was custom, it's just the string value
                custom_type: '',
                line1: initialData.line1,
                line2: initialData.line2 || '',
                city: initialData.city,
                state: initialData.state,
                zip: initialData.zip,
            });
            setShowCustomType(false);
        } else {
            form.reset({
                address_type: 'Legal',
                custom_type: '',
                line1: '',
                line2: '',
                city: '',
                state: '',
                zip: '',
            });
            setShowCustomType(false);
        }
    }, [initialData, form, open]);

    const watchType = form.watch("address_type");
    useEffect(() => {
        // If the type isn't in standard default list, it might be custom, 
        // but for the UI dropdown logic: if user selects 'Other', show input.
        if (watchType === 'Other') {
            setShowCustomType(true);
        } else {
            setShowCustomType(false);
        }
    }, [watchType]);

    const onSubmit = async (values: z.infer<typeof addressSchema>) => {
        setIsSubmitting(true);
        try {
            const finalType = values.address_type === 'Other' ? values.custom_type : values.address_type;

            if (!finalType) {
                form.setError('custom_type', { message: "Please specify the address type" });
                setIsSubmitting(false);
                return;
            }

            await createOrUpdateAddress({
                id: initialData?.id,
                entity_id: entityId,
                ...values,
                address_type: finalType
            });
            toast.success(initialData ? "Address updated" : "Address added");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Address" : "Add Address"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update this address information." : "Add a new address for this entity."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Address Type</Label>
                        <Select
                            onValueChange={(val) => form.setValue("address_type", val)}
                            value={form.watch("address_type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTypes.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.address_type && <p className="text-xs text-destructive">{form.formState.errors.address_type.message}</p>}
                    </div>

                    {showCustomType && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Specify Type</Label>
                            <Input placeholder="e.g. Warehouse" {...form.register("custom_type")} />
                            {form.formState.errors.custom_type && <p className="text-xs text-destructive">{form.formState.errors.custom_type.message}</p>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input placeholder="1234 Main St" {...form.register("line1")} />
                        {form.formState.errors.line1 && <p className="text-xs text-destructive">{form.formState.errors.line1.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Apartment, Suite, etc. (Optional)</Label>
                        <Input placeholder="Suite 100" {...form.register("line2")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input placeholder="City" {...form.register("city")} />
                            {form.formState.errors.city && <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Select
                                onValueChange={(val) => form.setValue("state", val)}
                                value={form.watch("state")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    {US_STATES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.state && <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Zip Code</Label>
                            <Input placeholder="12345" {...form.register("zip")} />
                            {form.formState.errors.zip && <p className="text-xs text-destructive">{form.formState.errors.zip.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Address
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
