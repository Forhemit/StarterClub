"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DocumentTable } from "./components/DocumentTable";
import { CreateDocumentDialog } from "./components/CreateDocumentDialog";
import { EditDocumentDialog } from "./components/EditDocumentDialog";
import { DeleteDocumentDialog } from "./components/DeleteDocumentDialog";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourcesClientProps {
    initialDocuments: any[];
}

export function ResourcesClient({ initialDocuments }: ResourcesClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [trackFilter, setTrackFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialog States
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [deletingDoc, setDeletingDoc] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Derived Filters
    const filteredDocuments = initialDocuments.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.doc_type.toLowerCase().includes(search.toLowerCase());
        const matchesTrack = trackFilter === 'all' || doc.track === trackFilter;
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesTrack && matchesStatus;
    });

    const handleSuccess = () => {
        router.refresh();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Filters */}
                    <Select value={trackFilter} onValueChange={setTrackFilter}>
                        <SelectTrigger className="w-[150px]" suppressHydrationWarning>
                            <SelectValue placeholder="Track" />
                        </SelectTrigger>
                        <SelectContent suppressHydrationWarning>
                            <SelectItem value="all">All Tracks</SelectItem>
                            <SelectItem value="shared">Shared</SelectItem>
                            <SelectItem value="banks">Banks</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]" suppressHydrationWarning>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent suppressHydrationWarning>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <CreateDocumentDialog onSuccess={handleSuccess} />
            </div>

            {/* Table */}
            <DocumentTable
                documents={filteredDocuments}
                onEdit={(doc) => {
                    setEditingDoc(doc);
                    setIsEditOpen(true);
                }}
                onDelete={(doc) => {
                    setDeletingDoc(doc);
                    setIsDeleteOpen(true);
                }}
            />

            {/* Dialogs */}
            <EditDocumentDialog
                document={editingDoc}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleSuccess}
            />

            <DeleteDocumentDialog
                document={deletingDoc}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
