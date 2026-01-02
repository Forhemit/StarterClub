import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { ContactCard } from "./ContactCard";
import { toast } from "sonner";
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
import { Skeleton } from "@/components/ui/skeleton";
import { LegalVaultData } from "./types";
import { ContactRecord } from "@/actions/contacts"; // Use import for compatibility

interface Step2Props {
    data: LegalVaultData;
    onUpdate: (data: Partial<LegalVaultData>) => void;
}

export function Step2ContactInfo({ data, onUpdate }: Step2Props) {
    const { contacts = [] } = data;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactRecord | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingContact(undefined);
        setIsFormOpen(true);
    };

    const handleEditClick = (contact: ContactRecord) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            const updatedContacts = contacts.filter(c => c.id !== deleteId);
            onUpdate({ contacts: updatedContacts as any });
            setDeleteId(null);
            toast.success("Contact removed");
        }
    };

    const handleContactSave = (newContact: any) => {
        let updatedContacts;
        // If editing
        if (editingContact) {
            updatedContacts = contacts.map(c => c.id === newContact.id ? newContact : c);
        } else {
            updatedContacts = [...contacts, newContact];
        }
        onUpdate({ contacts: updatedContacts as any });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Manage all contact points for this entity. At least one <strong>Legal</strong> contact is recommended.
                </p>
                <Button onClick={handleAddClick} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Phone / Email
                </Button>
            </div>

            <div className="grid gap-4">
                {contacts.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground mb-2">No contact records found.</p>
                        <Button variant="link" onClick={handleAddClick}>Add your first contact</Button>
                    </div>
                ) : (
                    contacts.map((contact: any) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>

            <ContactForm
                entityId={data.id || "temp"}
                initialData={editingContact}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSuccess={() => { }}
                onLocalSave={handleContactSave}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this contact record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
