"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Laptop, Monitor, Keyboard, Mouse, Headphones, Phone, CreditCard, Key } from "lucide-react";

import { type EquipmentOption } from "./types";

const DEFAULT_EQUIPMENT: EquipmentOption[] = [
    { id: "laptop", label: "Laptop", category: "Computing", enabled: true, icon: "Laptop" },
    { id: "monitor", label: "External Monitor", category: "Computing", enabled: true, icon: "Monitor" },
    { id: "keyboard", label: "Keyboard", category: "Peripherals", enabled: true, icon: "Keyboard" },
    { id: "mouse", label: "Mouse", category: "Peripherals", enabled: true, icon: "Mouse" },
    { id: "headset", label: "Headset", category: "Peripherals", enabled: true, icon: "Headphones" },
    { id: "phone", label: "Desk Phone", category: "Communication", enabled: false, icon: "Phone" },
    { id: "badge", label: "Access Badge", category: "Security", enabled: true, icon: "CreditCard" },
    { id: "keys", label: "Office Keys", category: "Security", enabled: false, icon: "Key" },
];

interface Step5EquipmentProps {
    equipment: EquipmentOption[];
    onEquipmentChange: (items: EquipmentOption[]) => void;
}

export function Step5Equipment({ equipment, onEquipmentChange }: Step5EquipmentProps) {
    const [newItemLabel, setNewItemLabel] = useState("");

    const toggleItem = (id: string) => {
        onEquipmentChange(
            equipment.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const removeItem = (id: string) => {
        onEquipmentChange(equipment.filter(item => item.id !== id));
    };

    const addItem = () => {
        if (!newItemLabel.trim()) return;
        const newItem: EquipmentOption = {
            id: `custom-${Date.now()}`,
            label: newItemLabel,
            category: "Custom",
            enabled: true,
            icon: "Laptop"
        };
        onEquipmentChange([...equipment, newItem]);
        setNewItemLabel("");
    };

    const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        Laptop, Monitor, Keyboard, Mouse, Headphones, Phone, CreditCard, Key
    };

    const categories = [...new Set(equipment.map(e => e.category))];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Equipment Provisioning</CardTitle>
                <CardDescription>
                    Configure the default equipment options available for new hires to request.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {categories.map(category => (
                    <div key={category} className="space-y-2">
                        <Badge variant="outline" className="mb-2">{category}</Badge>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {equipment.filter(e => e.category === category).map((item) => {
                                const Icon = IconMap[item.icon] || Laptop;
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.enabled ? 'bg-card border-primary/20' : 'bg-muted/30 opacity-60'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-md ${item.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                                            <Icon className={`w-4 h-4 ${item.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <span className="flex-1 font-medium text-sm">{item.label}</span>
                                        <Switch
                                            checked={item.enabled}
                                            onCheckedChange={() => toggleItem(item.id)}
                                        />
                                        {item.id.startsWith('custom-') && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="flex gap-2 pt-4 border-t">
                    <Input
                        placeholder="Add custom equipment..."
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                    <Button variant="outline" onClick={addItem} disabled={!newItemLabel.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export { DEFAULT_EQUIPMENT };
export type { EquipmentOption };
