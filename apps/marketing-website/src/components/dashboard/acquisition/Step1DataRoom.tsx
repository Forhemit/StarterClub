import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    FolderPlus,
    Upload,
    FileText,
    CheckCircle2,
    FileCheck,
    Plus,
    Trash2,
    Pencil,
    X,
    Check,
    Link as LinkIcon,
    Link2,
    FolderOpen,
    Settings2
} from "lucide-react";
import { AcquisitionReadinessData, DocumentItem, UploadedFile } from "./types";
import { cn } from "@/lib/utils";
import { DocumentUploadDialog } from "./DocumentUploadDialog";

interface Step1Props {
    data: AcquisitionReadinessData;
    onUpdate: (data: Partial<AcquisitionReadinessData>) => void;
}

export function Step1DataRoom({ data, onUpdate }: Step1Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
    const [fileToEdit, setFileToEdit] = useState<UploadedFile | null>(null);

    const updateDocs = (categoryId: string, newDocs: DocumentItem[]) => {
        const allDocs = { ...data.documents, [categoryId]: newDocs };

        // Recalculate total uploaded
        let totalUploaded = 0;
        Object.values(allDocs).forEach(categoryDocs => {
            if (categoryDocs) {
                totalUploaded += categoryDocs.reduce((acc, doc) => acc + (doc.files?.length || 0), 0);
            }
        });

        onUpdate({
            documents: allDocs,
            documents_uploaded: totalUploaded
        });
    };

    const handleUploadClick = (doc: DocumentItem) => {
        setSelectedDoc(doc);
        setFileToEdit(null); // New file mode
        setUploadDialogOpen(true);
    };

    const handleEditFile = (doc: DocumentItem, file: UploadedFile) => {
        setSelectedDoc(doc);
        setFileToEdit(file); // Edit existing file
        setUploadDialogOpen(true);
    };

    const handleUploadSave = (docId: string, newFile: UploadedFile) => {
        // Find category for this doc
        let categoryId = "";
        for (const [catId, docs] of Object.entries(data.documents || {})) {
            if (docs.some(d => d.id === docId)) {
                categoryId = catId;
                break;
            }
        }

        if (categoryId) {
            const currentDocs = data.documents?.[categoryId] || [];
            const updatedDocs = currentDocs.map(doc => {
                if (doc.id === docId) {
                    const existingFileIndex = doc.files.findIndex(f => f.id === newFile.id);
                    let newFiles = [...doc.files];

                    if (existingFileIndex !== -1) {
                        newFiles[existingFileIndex] = newFile;
                    } else {
                        newFiles.push(newFile);
                    }
                    return { ...doc, files: newFiles };
                }
                return doc;
            });
            updateDocs(categoryId, updatedDocs);
        }
        setSelectedDoc(null);
    };

    const handleDeleteFile = (docId: string, fileId: string) => {
        let categoryId = "";
        for (const [catId, docs] of Object.entries(data.documents || {})) {
            if (docs.some(d => d.id === docId)) {
                categoryId = catId;
                break;
            }
        }

        if (categoryId) {
            const currentDocs = data.documents?.[categoryId] || [];
            const updatedDocs = currentDocs.map(doc => {
                if (doc.id === docId) {
                    return { ...doc, files: doc.files.filter(f => f.id !== fileId) };
                }
                return doc;
            });
            updateDocs(categoryId, updatedDocs);
        }
    };

    const handleAddItem = (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent accordion toggle
        const currentDocs = data.documents?.[categoryId] || [];
        const newDoc: DocumentItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: "New Document",
            files: []
        };
        updateDocs(categoryId, [...currentDocs, newDoc]);

        // Auto-start editing the new item
        setEditingId(newDoc.id);
        setEditValue(newDoc.label);
    };

    const handleDeleteItem = (categoryId: string, docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const currentDocs = data.documents?.[categoryId] || [];
        const updatedDocs = currentDocs.filter(d => d.id !== docId);
        updateDocs(categoryId, updatedDocs);
    };

    const startEditing = (doc: DocumentItem) => {
        setEditingId(doc.id);
        setEditValue(doc.label);
    };

    const saveEdit = (categoryId: string, docId: string) => {
        const currentDocs = data.documents?.[categoryId] || [];
        const updatedDocs = currentDocs.map(doc => {
            if (doc.id === docId) {
                return { ...doc, label: editValue };
            }
            return doc;
        });
        updateDocs(categoryId, updatedDocs);
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const getCategoryStatus = (categoryId: string) => {
        const docs = data.documents?.[categoryId] || [];
        const uploaded = docs.reduce((acc, doc) => acc + (doc.files?.length || 0), 0);
        const total = docs.length; // Or maybe we want total required vs total uploaded? For now just showing count.
        return { uploaded, total: docs.length }; // Or remove total if it's dynamic
    };

    const renderCategory = (id: string, icon: React.ReactNode, title: string, subtitle: string) => (
        <AccordionItem value={id} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4 group">
                <div className="flex items-center gap-3 w-full pr-4">
                    {icon}
                    <div className="flex flex-col items-start text-left flex-1">
                        <span className="font-semibold">{title}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                            {subtitle}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="ml-auto">
                            {getCategoryStatus(id).uploaded} files
                        </Badge>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-2">
                <div className="flex justify-end mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary h-8"
                        onClick={(e) => handleAddItem(id, e)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Document Group
                    </Button>
                </div>

                {data.documents?.[id]?.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground border-dashed border-2 rounded-md">
                        No documents. Click "Add Document Group" to start.
                    </div>
                )}
                {data.documents?.[id]?.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 bg-card/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1 mr-4">
                                {editingId === doc.id ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-8 text-sm"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEdit(id, doc.id);
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => saveEdit(id, doc.id)}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group/label cursor-pointer" onClick={() => startEditing(doc)}>
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm flex items-center gap-2">
                                                {doc.label}
                                                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/label:opacity-100 transition-opacity" />
                                            </h3>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUploadClick(doc)}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add File
                                </Button>
                                {/* Only show delete for custom items */}
                                {['inc', 'bylaws', 'org_chart', 'board_mins', 'pl_curr', 'bs_curr', 'tax_returns', 'cap_table', 'ip_assignments', 'material_contracts', 'patents', 'trademarks'].indexOf(doc.id) === -1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => handleDeleteItem(id, doc.id, e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* File List */}
                        {doc.files.length > 0 ? (
                            <div className="space-y-2 pl-2">
                                {doc.files.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 rounded-md bg-background border group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {file.uploadType === 'link' ? (
                                                <Link2 className="h-4 w-4 text-blue-500 shrink-0" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <a href={file.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate">
                                                    {file.docName || file.fileName}
                                                </a>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                                    {file.fileSize && <span>• {Math.round(file.fileSize / 1024)} KB</span>}
                                                    {file.notes && (
                                                        <span className="flex items-center gap-1 text-muted-foreground/75 truncate max-w-[200px]">
                                                            <Settings2 className="h-3 w-3" />
                                                            {file.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => handleEditFile(doc, file)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteFile(doc.id, file.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="pl-10 py-1 text-xs text-muted-foreground italic">
                                Empty repository.
                            </div>
                        )}
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Info */}
            <div className="bg-muted p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                    Build a structured data room to share with potential acquirers. Add specific documents for each year or category as needed.
                </p>
            </div>

            {/* Inputs */}
            <div className="flex gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        type="text"
                        id="companyName"
                        placeholder="Acme Corp"
                        value={data.company_name}
                        onChange={(e) => onUpdate({ company_name: e.target.value })}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="dataRoomUrl">Data Room URL</Label>
                    <Input
                        type="url"
                        id="dataRoomUrl"
                        placeholder="https://dropbox.com/..."
                        value={data.data_room_url}
                        onChange={(e) => onUpdate({ data_room_url: e.target.value })}
                    />
                </div>
            </div>

            {/* Total Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-card border rounded-lg p-4 flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{data.documents_uploaded}</p>
                        <p className="text-xs text-muted-foreground">Total Documents</p>
                    </div>
                </div>
            </div>

            {/* Dynamic Accordions */}
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="corporate">
                {renderCategory(
                    "corporate",
                    <FolderPlus className="h-5 w-5 text-blue-500" />,
                    "Corporate",
                    "Formation, Bylaws, Org Chart"
                )}
                {renderCategory(
                    "financials",
                    <FileText className="h-5 w-5 text-green-500" />,
                    "Financials",
                    "P&L, Balance Sheets, Tax Returns"
                )}
                {renderCategory(
                    "legal_ip",
                    <FolderPlus className="h-5 w-5 text-purple-500" />,
                    "Legal & IP",
                    "Contracts, Patents, Trademarks"
                )}
            </Accordion>

            {selectedDoc && (
                <DocumentUploadDialog
                    open={uploadDialogOpen}
                    onOpenChange={setUploadDialogOpen}
                    doc={selectedDoc}
                    category={
                        Object.entries(data.documents || {}).find(([_, docs]) =>
                            docs.some(d => d.id === selectedDoc.id)
                        )?.[0] || ""
                    }
                    fileToEdit={fileToEdit}
                    onSave={handleUploadSave}
                />
            )}
        </div>
    );
}

