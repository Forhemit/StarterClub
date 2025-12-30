"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Users, FileText, Package, Globe, Sparkles } from "lucide-react";
import { ChecklistItem } from "./Step4Checklist";
import { EquipmentOption } from "./Step5Equipment";
import { AccessItem } from "./Step6Access";

interface Step7ReviewProps {
    checklist: ChecklistItem[];
    equipment: EquipmentOption[];
    access: AccessItem[];
    isInstalling: boolean;
    isInstalled: boolean;
    onInstall: () => void;
}

export function Step7Review({
    checklist,
    equipment,
    access,
    isInstalling,
    isInstalled,
    onInstall
}: Step7ReviewProps) {
    const enabledChecklist = checklist.filter(c => c.enabled);
    const enabledEquipment = equipment.filter(e => e.enabled);
    const enabledAccess = access.filter(a => a.enabled);
    const autoProvisionCount = access.filter(a => a.enabled && a.autoProvision).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review & Install</CardTitle>
                <CardDescription>
                    Review your configuration and install the HR Onboarding System.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Checklist Steps</span>
                        </div>
                        <p className="text-2xl font-bold">{enabledChecklist.length}</p>
                        <p className="text-xs text-muted-foreground">onboarding tasks</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Package className="w-4 h-4" />
                            <span className="text-sm font-medium">Equipment</span>
                        </div>
                        <p className="text-2xl font-bold">{enabledEquipment.length}</p>
                        <p className="text-xs text-muted-foreground">items available</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Globe className="w-4 h-4" />
                            <span className="text-sm font-medium">Systems</span>
                        </div>
                        <p className="text-2xl font-bold">{enabledAccess.length}</p>
                        <p className="text-xs text-muted-foreground">{autoProvisionCount} auto-provisioned</p>
                    </div>
                </div>

                {/* Configuration Summary */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-sm text-muted-foreground">Configuration Summary</h4>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Onboarding Steps:</p>
                        <div className="flex flex-wrap gap-2">
                            {enabledChecklist.map(item => (
                                <Badge key={item.id} variant="secondary">{item.label}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Equipment Options:</p>
                        <div className="flex flex-wrap gap-2">
                            {enabledEquipment.map(item => (
                                <Badge key={item.id} variant="outline">{item.label}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Install Section */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">HR Onboarding System</h3>
                    <p className="text-sm text-muted-foreground mb-4">v1.0.0 • Free</p>

                    {isInstalled ? (
                        <Button variant="outline" className="border-green-200 bg-green-50 text-green-700" disabled>
                            <Check className="w-4 h-4 mr-2" />
                            Installed Successfully
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={onInstall}
                            disabled={isInstalling}
                            className="shadow-lg"
                        >
                            {isInstalling ? (
                                <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    Installing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Install & Configure
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Features */}
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Gamified race track experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Role-Level Security (RLS) enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Integrated with Member Dashboard</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
