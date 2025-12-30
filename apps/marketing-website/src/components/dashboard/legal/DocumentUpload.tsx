"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileCheck, Trash2 } from "lucide-react";
import { uploadLegalDocument, deleteLegalDocument } from "@/actions/documents";
import { DocumentMetadataDialog } from "./DocumentMetadataDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
    entityId: string;
    documentType: string;
    documentId?: string;
    existingPath?: string;
    onUploadComplete: () => void;
}

export function DocumentUpload({ entityId, documentType, documentId, existingPath, onUploadComplete }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(existingPath ? (existingPath.split('/').pop() || null) : null);

    // Dialog State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation (PDF/Image only, max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setSelectedFile(file);
        setIsDialogOpen(true);
        // Reset input value so same file can be selected again if needed
        e.target.value = '';
    };

    const handleUploadConfirm = async (metadata: { displayName: string; expirationDate: string | null }) => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('entityId', entityId);
            formData.append('documentType', documentType);
            formData.append('displayName', metadata.displayName);
            if (metadata.expirationDate) {
                formData.append('expirationDate', metadata.expirationDate);
            }

            await uploadLegalDocument(formData);

            setFileName(selectedFile.name);
            toast.success("Document uploaded successfully");
            onUploadComplete();

        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
        }
    };

    const handleDelete = async () => {
        if (!documentId || !existingPath) return;

        setIsUploading(true);
        try {
            await deleteLegalDocument(documentId, existingPath, entityId);
            setFileName(null);
            toast.success("Document deleted");
            onUploadComplete();
        } catch (error: any) {
            console.error("Delete failed", error);
            toast.error("Failed to delete document");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <DocumentMetadataDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedFile(null);
                }}
                file={selectedFile}
                documentType={documentType}
                onConfirm={handleUploadConfirm}
            />

            {isUploading ? (
                <Button variant="outline" size="sm" disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                </Button>
            ) : fileName ? (
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                        <FileCheck className="w-4 h-4 mr-2" />
                        Uploaded
                    </Button>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{fileName}</span>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete "<strong>{fileName}</strong>" from the vault. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : (
                <Button variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                        <input
                            type="file"
                            id={`upload-${documentType}`}
                            className="hidden"
                            accept=".pdf,image/png,image/jpeg"
                            onChange={handleFileSelect}
                        />
                    </label>
                </Button>
            )}
        </div>
    );
}
