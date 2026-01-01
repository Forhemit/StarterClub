"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function EmbedButton({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
    const [copied, setCopied] = useState(false);

    // In production, this should be the full domain
    // Using simple location.origin if possible, but during SSR/generation we might need env var
    // For now, let's assume relative or a hardcoded placeholder that gets replaced on client
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const embedUrl = `${origin}/jobs/embed/${jobId}`;
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="600px" frameborder="0"></iframe>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success("Embed code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Code className="w-4 h-4 mr-2" />
                    Embed
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Embed Job Post</DialogTitle>
                    <DialogDescription>
                        Copy this code to embed <strong>{jobTitle}</strong> on your website.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={embedCode}
                            readOnly
                            className="font-mono text-xs h-9 bg-muted"
                        />
                    </div>
                    <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
