"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Mail, MessageSquare, Cloud, Database, Video, Lock, Globe, FolderOpen } from "lucide-react";

import { type AccessItem } from "./types";

const DEFAULT_ACCESS: AccessItem[] = [
    { id: "email", label: "Email (Google/Microsoft)", category: "Communication", enabled: true, icon: "Mail", autoProvision: true },
    { id: "slack", label: "Slack", category: "Communication", enabled: true, icon: "MessageSquare", autoProvision: true },
    { id: "zoom", label: "Zoom", category: "Communication", enabled: true, icon: "Video", autoProvision: true },
    { id: "google-drive", label: "Google Drive", category: "Storage", enabled: true, icon: "Cloud", autoProvision: true },
    { id: "notion", label: "Notion", category: "Productivity", enabled: true, icon: "FolderOpen", autoProvision: false },
    { id: "github", label: "GitHub", category: "Development", enabled: false, icon: "Database", autoProvision: false },
    { id: "vpn", label: "VPN Access", category: "Security", enabled: false, icon: "Lock", autoProvision: false },
    { id: "intranet", label: "Company Intranet", category: "Internal", enabled: true, icon: "Globe", autoProvision: true },
];

interface Step6AccessProps {
    access: AccessItem[];
    onAccessChange: (items: AccessItem[]) => void;
}

export function Step6Access({ access, onAccessChange }: Step6AccessProps) {
    const [newItemLabel, setNewItemLabel] = useState("");

    const toggleItem = (id: string) => {
        onAccessChange(
            access.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const toggleAutoProvision = (id: string) => {
        onAccessChange(
            access.map(item =>
                item.id === id ? { ...item, autoProvision: !item.autoProvision } : item
            )
        );
    };

    const removeItem = (id: string) => {
        onAccessChange(access.filter(item => item.id !== id));
    };

    const addItem = () => {
        if (!newItemLabel.trim()) return;
        const newItem: AccessItem = {
            id: `custom-${Date.now()}`,
            label: newItemLabel,
            category: "Custom",
            enabled: true,
            icon: "Globe",
            autoProvision: false
        };
        onAccessChange([...access, newItem]);
        setNewItemLabel("");
    };

    const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        Mail, MessageSquare, Cloud, Database, Video, Lock, Globe, FolderOpen
    };

    const enabledCount = access.filter(a => a.enabled).length;
    const autoCount = access.filter(a => a.enabled && a.autoProvision).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Access Setup</CardTitle>
                <CardDescription>
                    Configure which systems new hires need access to. Enable auto-provisioning for seamless onboarding.
                </CardDescription>
                <div className="flex gap-2 pt-2">
                    <Badge variant="secondary">{enabledCount} systems enabled</Badge>
                    <Badge variant="outline">{autoCount} auto-provisioned</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {access.map((item) => {
                        const Icon = IconMap[item.icon] || Globe;
                        return (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${item.enabled ? 'bg-card' : 'bg-muted/30 opacity-60'
                                    }`}
                            >
                                <div className={`p-2 rounded-md ${item.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                                    <Icon className={`w-4 h-4 ${item.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Auto</span>
                                        <Switch
                                            checked={item.autoProvision}
                                            onCheckedChange={() => toggleAutoProvision(item.id)}
                                            disabled={!item.enabled}
                                            className="scale-75"
                                        />
                                    </div>
                                    <Switch
                                        checked={item.enabled}
                                        onCheckedChange={() => toggleItem(item.id)}
                                    />
                                </div>
                                {item.id.startsWith('custom-') && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    <Input
                        placeholder="Add custom system..."
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                    <Button variant="outline" onClick={addItem} disabled={!newItemLabel.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export { DEFAULT_ACCESS };
export type { AccessItem };
