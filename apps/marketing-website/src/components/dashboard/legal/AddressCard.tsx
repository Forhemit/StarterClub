"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { AddressRecord } from "@/actions/addresses";
import { Badge } from "@/components/ui/badge";

interface AddressCardProps {
    address: AddressRecord;
    onEdit: (addr: AddressRecord) => void;
    onDelete: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <Card className="p-4 flex items-start justify-between group hover:shadow-md transition-all">
            <div className="flex gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{address.address_type} Address</span>
                        {address.is_primary && <Badge variant="secondary" className="text-[10px] h-5">Primary</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground leading-snug">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>{address.city}, {address.state} {address.zip}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(address)}>
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(address.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </Card>
    );
}
