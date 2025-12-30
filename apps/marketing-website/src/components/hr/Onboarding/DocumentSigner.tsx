"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentSignerProps {
    onComplete?: () => void;
}

const DOCUMENTS = [
    { id: "offer", name: "Offer Letter", required: true },
    { id: "nda", name: "Non-Disclosure Agreement (NDA)", required: true },
    { id: "handbook", name: "Employee Handbook", required: true },
    { id: "w4", name: "W-4 Tax Form", required: true },
];

export function DocumentSigner({ onComplete }: DocumentSignerProps) {
    const [signedDocs, setSignedDocs] = useState<string[]>([]);
    const [isSigning, setIsSigning] = useState<string | null>(null);

    const handleSign = async (docId: string) => {
        setIsSigning(docId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSignedDocs(prev => [...prev, docId]);
        setIsSigning(null);
        toast.success("Document signed");

        // Check if all signed
        if (signedDocs.length + 1 === DOCUMENTS.length) {
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500);
        }
    };

    return (
        <Card className="border-dashed bg-muted/20">
            <CardHeader>
                <CardTitle>Digital Paperwork</CardTitle>
                <CardDescription>Review and sign mandatory employment documents.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {DOCUMENTS.map((doc) => {
                        const isSigned = signedDocs.includes(doc.id);
                        const isCurrentSigning = isSigning === doc.id;

                        return (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isSigned ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {isSigned ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium">{doc.name}</div>
                                        <div className="text-xs text-muted-foreground">{isSigned ? 'Signed on ' + new Date().toLocaleDateString() : 'Pending signature'}</div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isSigned ? "ghost" : "default"}
                                    disabled={isSigned || isSigning !== null}
                                    onClick={() => handleSign(doc.id)}
                                >
                                    {isCurrentSigning ? <Loader2 className="h-4 w-4 animate-spin" /> : isSigned ? "Signed" : "Sign Now"}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
