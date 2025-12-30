import { ContactRecord } from "@/actions/contacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";

interface ContactCardProps {
    contact: ContactRecord;
    onEdit: (contact: ContactRecord) => void;
    onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
    return (
        <Card className="relative group overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-all">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{contact.contact_type}</span>
                            {contact.is_primary && (
                                <Badge variant="secondary" className="text-[10px] h-5">Primary</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(contact)}>
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => contact.id && onDelete(contact.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground mt-3">
                    {contact.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{contact.phone}</span>
                        </div>
                    )}
                    {contact.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{contact.email}</span>
                        </div>
                    )}
                    {(contact.address_line1 || contact.city) && (
                        <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 mt-0.5" />
                            <div className="flex flex-col">
                                <span>{contact.address_line1}</span>
                                {contact.address_line2 && <span>{contact.address_line2}</span>}
                                <span>
                                    {[contact.city, contact.state, contact.zip].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
