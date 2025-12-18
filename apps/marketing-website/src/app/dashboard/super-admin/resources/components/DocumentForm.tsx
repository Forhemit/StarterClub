"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResourceAssetSchema } from "@/app/dashboard/super-admin/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
            file_url: "",
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Q4 Policy Update" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="doc_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="asset">Asset (File)</SelectItem>
                                        <SelectItem value="policy">Policy</SelectItem>
                                        <SelectItem value="guide">Guide</SelectItem>
                                        <SelectItem value="template">Template</SelectItem>
                                        <SelectItem value="api">API Doc</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="track"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Track</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select track" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="shared">Shared</SelectItem>
                                        <SelectItem value="banks">Banks</SelectItem>
                                        <SelectItem value="insurance">Insurance</SelectItem>
                                        <SelectItem value="hardware">Hardware</SelectItem>
                                        <SelectItem value="saas">SaaS</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Dynamic Fields based on Type */}
                {docType === 'asset' || docType === 'template' ? (
                    <FormField
                        control={form.control}
                        name="file_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>File URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content (Markdown)</FormLabel>
                                <FormControl>
                                    <Textarea className="min-h-[150px] font-mono" placeholder="# Markdown content here..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="partner">Partner</SelectItem>
                                        <SelectItem value="admin">Admin Only</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Document
                    </Button>
                </div>
            </form>
        </Form>
    );
}
