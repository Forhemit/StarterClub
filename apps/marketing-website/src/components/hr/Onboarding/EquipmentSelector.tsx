"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Laptop, Monitor, Mouse, Smartphone, Armchair } from "lucide-react";
import { createEquipmentRequest, getEquipmentRequests } from "@/actions/hr-onboarding";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EQUIPMENT_OPTIONS = [
    { id: "laptop_pro", name: "MacBook Pro 16\"", icon: Laptop, type: "laptop" },
    { id: "laptop_air", name: "MacBook Air 13\"", icon: Laptop, type: "laptop" },
    { id: "monitor_4k", name: "32\" 4K Monitor", icon: Monitor, type: "monitor" },
    { id: "peripherals_kit", name: "Mouse & Keyboard Kit", icon: Mouse, type: "accessory" },
    { id: "phone_company", name: "Company iPhone 15", icon: Smartphone, type: "phone" },
    { id: "ergo_chair", name: "Ergonomic Chair", icon: Armchair, type: "furniture" },
];

interface EquipmentSelectorProps {
    employeeId: string;
    onComplete?: () => void;
}

export function EquipmentSelector({ employeeId, onComplete }: EquipmentSelectorProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingRequests, setExistingRequests] = useState<any[]>([]);

    useEffect(() => {
        // Fetch existing
        getEquipmentRequests(employeeId).then(data => {
            setExistingRequests(data);
            // Pre-select if needed or just show status
        });
    }, [employeeId]);

    const handleToggle = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const hasAlreadyRequested = (id: string) => {
        // Simple match logic - in real app, match more robustly
        return existingRequests.some(r => r.equipment_type === id); // We used ID as type for simplicity in this demo
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Sequential for simplicity
            for (const item of selectedItems) {
                const result = await createEquipmentRequest({
                    employeeId,
                    equipment_type: item,
                    status: 'pending'
                });
                if (result.error) throw new Error(result.error);
            }
            toast.success("Equipment requested successfully!");
            if (onComplete) onComplete();
            // Refresh list
            const data = await getEquipmentRequests(employeeId);
            setExistingRequests(data);
            setSelectedItems([]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit requests");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-dashed bg-muted/20">
            <CardHeader>
                <CardTitle>Equipment Provisioning</CardTitle>
                <CardDescription>Select the hardware needed for this role. IT will be notified.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {EQUIPMENT_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedItems.includes(item.id);
                        const isRequested = hasAlreadyRequested(item.id);

                        return (
                            <div
                                key={item.id}
                                onClick={() => !isRequested && handleToggle(item.id)}
                                className={`
                                    relative p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2
                                    ${isRequested
                                        ? "bg-green-50 border-green-200 opacity-80 cursor-default"
                                        : isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                                    }
                                `}
                            >
                                {isRequested && <div className="absolute top-2 right-2 text-green-600"><Check className="w-4 h-4" /></div>}
                                <Icon className={`w-8 h-8 ${isSelected || isRequested ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isSubmitting || selectedItems.length === 0}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request ({selectedItems.length})
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
