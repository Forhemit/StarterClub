"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getContactsForEntity, deleteContact, ContactRecord } from "@/actions/contacts";
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

interface Step2Props {
    entityId: string | null;
    onSave?: (id: string) => void;
}

export function Step2ContactInfo({ entityId, onSave }: Step2Props) {
    const [contacts, setContacts] = useState<ContactRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactRecord | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const loadContacts = async () => {
        if (!entityId) return;
        setIsLoading(true);
        const data = await getContactsForEntity(entityId);
        // Cast the data to ContactRecord[] to fix type mismatch with the Supabase response
        const typedData: ContactRecord[] = data ? data.map(record => ({
            ...record,
            contact_type: record.contact_type as any // Assert type as it comes from DB as string
        })) : [];
        setContacts(typedData);
        setIsLoading(false);
    };

    useEffect(() => {
        loadContacts();
    }, [entityId]);

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

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteContact(deleteId);
            toast.success("Contact deleted");
            setDeleteId(null);
            loadContacts();
            onSave?.(entityId!);
        }
    };

    const handleSuccess = () => {
        loadContacts();
        onSave?.(entityId!);
    };

    if (!entityId) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Please complete Step 1 to generate an Entity ID before adding contacts.</p>
            </div>
        );
    }

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
                {isLoading ? (
                    <div className="grid gap-4">
                        <Skeleton className="h-[100px] w-full rounded-xl" />
                        <Skeleton className="h-[100px] w-full rounded-xl" />
                        <Skeleton className="h-[100px] w-full rounded-xl" />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground mb-2">No contact records found.</p>
                        <Button variant="link" onClick={handleAddClick}>Add your first contact</Button>
                    </div>
                ) : (
                    contacts.map((contact) => (
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
                entityId={entityId}
                initialData={editingContact}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSuccess={handleSuccess}
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
