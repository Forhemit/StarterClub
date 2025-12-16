"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResourceAssetSchema } from "@/app/dashboard/super-admin/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type DocumentFormValues = z.infer<typeof ResourceAssetSchema>;

interface DocumentFormProps {
    defaultValues?: Partial<DocumentFormValues>;
    onSubmit: (values: DocumentFormValues) => Promise<void>;
}

export function DocumentForm({ defaultValues, onSubmit }: DocumentFormProps) {
    const [loading, setLoading] = useState(false);

    // Set robust defaults
    const form = useForm<DocumentFormValues>({
        resolver: zodResolver(ResourceAssetSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            track: "shared",
            doc_type: "asset",
            status: "draft",
            visibility: "partner",
            type: "pdf",
            file_url: "", // Can be empty initially if not strictly required by UI logic, but Schema validates usage
            content: "",
            ...defaultValues
        }
    });

    const docType = form.watch("doc_type");

    const handleSubmit = async (data: DocumentFormValues) => {
        setLoading(true);
        try {
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} placeholder="e.g. Q4 Policy Update" />
                {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select defaultValue={form.getValues("doc_type")} onValueChange={v => form.setValue("doc_type", v as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asset">Asset (File)</SelectItem>
                            <SelectItem value="policy">Policy</SelectItem>
                            <SelectItem value="guide">Guide</SelectItem>
                            <SelectItem value="template">Template</SelectItem>
                            <SelectItem value="api">API Doc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Track</Label>
                    <Select defaultValue={form.getValues("track")} onValueChange={v => form.setValue("track", v as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select track" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="shared">Shared</SelectItem>
                            <SelectItem value="banks">Banks</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="Short description..." />
            </div>

            {/* Dynamic Fields based on Type */}
            {docType === 'asset' || docType === 'template' ? (
                <div className="space-y-2">
                    <Label>File URL</Label>
                    <Input {...form.register("file_url")} placeholder="https://..." />
                    {form.formState.errors.file_url && <p className="text-destructive text-sm">{form.formState.errors.file_url.message}</p>}
                </div>
            ) : (
                <div className="space-y-2">
                    <Label>Content (Markdown)</Label>
                    <Textarea {...form.register("content")} className="min-h-[150px] font-mono" placeholder="# Markdown content here..." />
                    {form.formState.errors.content && <p className="text-destructive text-sm">{form.formState.errors.content.message}</p>}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={form.getValues("status")} onValueChange={v => form.setValue("status", v as any)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select defaultValue={form.getValues("visibility")} onValueChange={v => form.setValue("visibility", v as any)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="partner">Partner</SelectItem>
                            <SelectItem value="admin">Admin Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Document
                </Button>
            </div>
        </form>
    );
}
