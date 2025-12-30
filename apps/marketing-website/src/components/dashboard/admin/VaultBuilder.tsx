"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Save, Play, RefreshCw } from "lucide-react";

const DEFAULT_JSON = `{
  "moduleId": "new-module",
  "title": "New Module",
  "description": "Description of the new module",
  "type": "custom",
  "version": "1.0.0",
  "components": []
}`;

export function VaultBuilder() {
    const [jsonContent, setJsonContent] = useState(DEFAULT_JSON);
    const [parsedJson, setParsedJson] = useState<any>(JSON.parse(DEFAULT_JSON));
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setJsonContent(value);

        try {
            const parsed = JSON.parse(value);
            setParsedJson(parsed);
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Invalid JSON");
            }
        }
    };

    const handleSave = async () => {
        if (error) return;
        setIsSaving(true);

        // TODO: Implement save logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save

        setIsSaving(false);
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(jsonContent);
            setJsonContent(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (err) {
            // If invalid, we can't format, just keep as is or show error
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
            {/* Editor Sided */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col flex-1 h-full border-muted/50 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-muted/20">
                        <div className="space-y-1">
                            <CardTitle>Module Configuration</CardTitle>
                            <CardDescription>Define your module structure in JSON</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={formatJson}
                                title="Format JSON"
                            >
                                <RefreshCw className="h-4 w-4 mr-1" /> Format
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!!error || isSaving}
                            >
                                <Save className="h-4 w-4 mr-1" />
                                {isSaving ? "Saving..." : "Save Module"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative">
                        <Textarea
                            value={jsonContent}
                            onChange={handleJsonChange}
                            className="h-full w-full resize-none rounded-none border-0 p-4 font-mono text-sm leading-relaxed focus-visible:ring-0"
                            placeholder="Place your JSON here..."
                            spellCheck={false}
                        />
                    </CardContent>
                    {error ? (
                        <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-md border border-destructive/20 flex items-center gap-2 mt-auto">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-mono">{error}</span>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 text-emerald-600 text-xs p-3 rounded-md border border-emerald-500/20 flex items-center gap-2 mt-auto">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Valid JSON Configuration</span>
                        </div>
                    )}
                </Card>
            </div>

            {/* Preview Side */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col flex-1 h-full border-muted/50 shadow-sm bg-muted/5">
                    <CardHeader className="border-b bg-card">
                        <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-primary" />
                            Preview
                        </CardTitle>
                        <CardDescription>Live preview of your module settings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 overflow-auto">
                        {!error && parsedJson ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold tracking-tight">{parsedJson.title || "Untitled Module"}</h3>
                                    <p className="text-sm text-muted-foreground">{parsedJson.description || "No description provided."}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {parsedJson.type && <Badge variant="secondary">{parsedJson.type}</Badge>}
                                        {parsedJson.version && <Badge variant="outline">v{parsedJson.version}</Badge>}
                                        {parsedJson.moduleId && <Badge variant="outline" className="font-mono text-xs">{parsedJson.moduleId}</Badge>}
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-card p-4">
                                    <h4 className="text-sm font-medium mb-3">Components Structure</h4>
                                    {Array.isArray(parsedJson.components) && parsedJson.components.length > 0 ? (
                                        <ul className="space-y-2">
                                            {parsedJson.components.map((comp: any, i: number) => (
                                                <li key={i} className="text-sm border-l-2 border-primary/20 pl-3 py-1">
                                                    <span className="font-medium">{comp.type || "Unknown Component"}</span>
                                                    {comp.id && <span className="text-xs text-muted-foreground ml-2">#{comp.id}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No components defined.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <AlertCircle className="h-12 w-12 mb-2" />
                                <p>Fix JSON errors to view preview</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
