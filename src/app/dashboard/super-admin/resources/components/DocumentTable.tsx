"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, FileText, ExternalLink } from "lucide-react";

interface Document {
    id: string;
    title: string;
    doc_type: string;
    status: string;
    track: string;
    updated_at: string;
    author_id?: string;
    file_url?: string;
}

interface DocumentTableProps {
    documents: Document[];
    onEdit: (doc: Document) => void;
    onDelete: (doc: Document) => void;
    onSelect?: (ids: string[]) => void;
}

export function DocumentTable({ documents, onEdit, onDelete }: DocumentTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No documents found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        documents.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{doc.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {doc.doc_type || 'asset'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground capitalize">{doc.track}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={doc.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                                        {doc.status || 'published'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(doc)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
