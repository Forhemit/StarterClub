
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, Link as LinkIcon, FileText, X, CalendarIcon } from "lucide-react";
import { DocumentItem, UploadedFile } from "./types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DocumentUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doc: DocumentItem;
    category?: string;
    fileToEdit?: UploadedFile | null;
    onSave: (docId: string, newFile: UploadedFile) => void;
}

export function DocumentUploadDialog({ open, onOpenChange, doc, category, fileToEdit, onSave }: DocumentUploadDialogProps) {
    const [activeTab, setActiveTab] = useState<"file" | "link">("file");
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");

    // Metadata State
    const [docName, setDocName] = useState("");
    const [docDate, setDocDate] = useState<Date | undefined>(undefined);
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState("");
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (open) {
            if (fileToEdit) {
                // Edit Mode
                setDocName(fileToEdit.docName);
                setDocDate(fileToEdit.docDate ? new Date(fileToEdit.docDate) : undefined);
                setHasExpiry(fileToEdit.hasExpiry || false);
                setExpiryDate(fileToEdit.expiryDate ? new Date(fileToEdit.expiryDate) : undefined);
                setNotes(fileToEdit.notes || "");
                setUrl(fileToEdit.fileUrl || "");
                if (fileToEdit.uploadType) setActiveTab(fileToEdit.uploadType);
            } else {
                // New Add Mode
                setDocName(doc.label); // Default name match parent
                setDocDate(undefined);
                setHasExpiry(false);
                setExpiryDate(undefined);
                setNotes("");
                setFile(null);
                setUrl("");
                setActiveTab("file");
            }
        }
    }, [open, doc, fileToEdit]);


    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSave = () => {
        const newFileId = fileToEdit?.id || Math.random().toString(36).substr(2, 9);

        const newFile: UploadedFile = {
            id: newFileId,
            uploadedAt: fileToEdit?.uploadedAt || new Date().toISOString(),
            notes: notes,
            uploadType: activeTab,
            docName: docName,
            docDate: docDate?.toISOString(),
            hasExpiry: hasExpiry,
            expiryDate: hasExpiry && expiryDate ? expiryDate.toISOString() : undefined,
            // Retain existing values if editing and not changed
            fileName: fileToEdit?.fileName,
            fileSize: fileToEdit?.fileSize,
            fileType: fileToEdit?.fileType,
            fileUrl: fileToEdit?.fileUrl
        };

        if (activeTab === "file" && file) {
            newFile.fileName = file.name;
            newFile.fileSize = file.size;
            newFile.fileType = file.type;
            newFile.fileUrl = URL.createObjectURL(file);
        } else if (activeTab === "link" && url) {
            newFile.fileName = url;
            newFile.fileUrl = url;
        }

        onSave(doc.id, newFile);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{fileToEdit ? "Edit Document" : "Upload Document"}</DialogTitle>
                    <DialogDescription>
                        {category ? <span className="capitalize font-medium text-foreground mr-1">{category} &gt;</span> : null}
                        {doc.label}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* 1. Document Name & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="docName">Display Name</Label>
                            <Input
                                id="docName"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                placeholder="E.g. 2023 Tax Return"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <Label>Document Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !docDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {docDate ? format(docDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={docDate}
                                        onSelect={setDocDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* 2. Upload Area */}
                    <Tabs defaultValue="file" value={activeTab} onValueChange={(v) => setActiveTab(v as "file" | "link")}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="file">Upload File</TabsTrigger>
                            <TabsTrigger value="link">External Link</TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="space-y-4">
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                                    (file || (fileToEdit && fileToEdit.uploadType === 'file' && !file)) ? "bg-muted/30" : ""
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="h-10 w-10 text-primary mb-2" />
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
                                        <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:text-destructive" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}>
                                            Change File
                                        </Button>
                                    </div>
                                ) : (fileToEdit && fileToEdit.uploadType === 'file' && !file) ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="h-10 w-10 text-green-600 mb-2" />
                                        <p className="font-medium text-sm text-green-700">Current: {fileToEdit.fileName}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="link" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">Document URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="url"
                                        placeholder="https://drive.google.com/..."
                                        className="pl-9"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* 3. Expiration & Notes */}
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between border rounded-lg p-3">
                            <div className="space-y-0.5">
                                <Label className="text-base">Expiration Date</Label>
                                <p className="text-xs text-muted-foreground">Does this document expire?</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {hasExpiry && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                size="sm"
                                                className={cn(
                                                    "w-[140px] justify-start text-left font-normal",
                                                    !expiryDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {expiryDate ? format(expiryDate, "PP") : <span>Pick date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={expiryDate}
                                                onSelect={setExpiryDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                <Switch checked={hasExpiry} onCheckedChange={setHasExpiry} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add context like 'Draft', 'Signed', or version number..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="resize-none"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>
                        Save Details
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
