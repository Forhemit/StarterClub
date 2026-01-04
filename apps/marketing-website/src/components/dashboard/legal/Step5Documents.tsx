import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { getEntityDocuments } from "@/actions/documents";
import { DocumentUpload } from "./DocumentUpload";
import { LegalVaultData } from "./types";

interface Step5Props {
    data: LegalVaultData;
    onUpdate: (data: Partial<LegalVaultData>) => void;
}

export function Step5Documents({ data, onUpdate }: Step5Props) {
    const { id: entityId, documents = [], comments = "" } = data;

    const requiredDocs = [
        "Articles of Incorporation / Organization",
        "Operating Agreement / Bylaws",
        "Registered Agent Acceptance",
        "Initial Resolutions"
    ];

    const handleUploadComplete = async () => {
        if (!entityId) return;
        try {
            // Re-fetch documents to keep local state in sync with server side effects
            const freshDocs = await getEntityDocuments(entityId);
            onUpdate({ documents: freshDocs as any }); // Cast if needed
        } catch (error) {
            console.error("Failed to refresh documents", error);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                {requiredDocs.map((doc, i) => {
                    const existingDoc = documents.find(d => d.type === doc);
                    return (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="space-y-1">
                                <span className="flex items-center gap-2">
                                    <Label className="text-base">{existingDoc?.name || doc}</Label>
                                    {existingDoc && <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />}
                                </span>
                                {(existingDoc?.name && existingDoc.name !== doc) && (
                                    <p className="text-xs text-muted-foreground">Type: {doc}</p>
                                )}
                                { /* Refactor Note: expiration_date removed as it is not in the schema currently */}
                                <p className="text-sm text-muted-foreground">Required for compliance</p>
                            </div>
                            <DocumentUpload
                                entityId={entityId || ""}
                                documentType={doc}
                                documentId={existingDoc?.id}
                                existingPath={existingDoc?.url}
                                onUploadComplete={handleUploadComplete}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="comments">General Comments / Notes</Label>
                <Textarea
                    id="comments"
                    placeholder="Add any additional notes about these documents or compliance status..."
                    value={comments || ""}
                    onChange={(e) => onUpdate({ comments: e.target.value })}
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}
