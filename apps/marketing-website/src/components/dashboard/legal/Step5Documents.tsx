import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle } from "lucide-react";
import { createOrUpdateLegalEntity, getLegalEntity } from "@/actions/legal-vault";
import { getEntityDocuments, LegalDocument } from "@/actions/documents";
import { DocumentUpload } from "./DocumentUpload";

interface Step5Props {
    entityId: string | null;
    onSave: (id: string) => void;
}

export function Step5Documents({ entityId, onSave }: Step5Props) {
    const requiredDocs = [
        "Articles of Incorporation / Organization",
        "Operating Agreement / Bylaws",
        "Registered Agent Acceptance",
        "Initial Resolutions"
    ];

    const [comments, setComments] = useState("");
    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadDocuments = useCallback(async () => {
        if (!entityId) return;
        try {
            const docs = await getEntityDocuments(entityId);
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to load documents", error);
        }
    }, [entityId]);

    // Load Data
    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const data = await getLegalEntity();
            if (!mounted) return;

            if (data) {
                if (data.comments) setComments(data.comments);
                // Only call onSave if we don't already have an entityId (first load)
                if (data.id && !entityId) {
                    onSave(data.id);
                }
            }
            setIsLoaded(true);
        }
        loadData();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (entityId) {
            loadDocuments();
        }
    }, [entityId, loadDocuments]);

    // Auto-Save Comments
    useEffect(() => {
        if (!isLoaded || !entityId) return;
        const timeoutId = setTimeout(async () => {
            try {
                await createOrUpdateLegalEntity({
                    id: entityId,
                    comments
                });
                if (entityId) onSave(entityId);
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [comments, entityId, isLoaded]);

    const handleUploadComplete = () => {
        loadDocuments();
        if (entityId) onSave(entityId);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                {requiredDocs.map((doc, i) => {
                    const existingDoc = documents.find(d => d.document_type === doc);
                    return (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="space-y-1">
                                <span className="flex items-center gap-2">
                                    <Label className="text-base">{existingDoc?.display_name || doc}</Label>
                                    {existingDoc && <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />}
                                </span>
                                {(existingDoc?.display_name && existingDoc.display_name !== doc) && (
                                    <p className="text-xs text-muted-foreground">Type: {doc}</p>
                                )}
                                {existingDoc?.expiration_date && (
                                    <p className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md inline-block border border-amber-100 mr-2">
                                        Expires: {new Date(existingDoc.expiration_date).toLocaleDateString()}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">Required for compliance</p>
                            </div>
                            <DocumentUpload
                                entityId={entityId || ""}
                                documentType={doc}
                                documentId={existingDoc?.id}
                                existingPath={existingDoc?.file_path}
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
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}
