"use client";

import { useState } from "react";
import { MemberDashboardUI, ChecklistStatus } from "@/components/dashboard/MemberDashboardUI";
import { MARKETPLACE_MODULES } from "@/lib/marketplace/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, LayoutDashboard, Settings2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TestMemberDashboard() {
    // Simulation State
    const [progress, setProgress] = useState([35]);
    const [installedModuleIds, setInstalledModuleIds] = useState<Set<string>>(new Set());
    const [memberStage, setMemberStage] = useState<'new' | 'existing'>('new');
    const [employeeCount, setEmployeeCount] = useState<number>(1);
    const [employeeNames, setEmployeeNames] = useState<string[]>(['Test User']);

    const handleEmployeeCountChange = (count: number) => {
        const newCount = Math.max(1, count);
        setEmployeeCount(newCount);

        // Resize names array
        setEmployeeNames(prev => {
            const newNames = [...prev];
            if (newNames.length < newCount) {
                // Add default names
                for (let i = newNames.length; i < newCount; i++) {
                    newNames.push(`Employee ${i + 1}`);
                }
            } else {
                // Trim array
                return newNames.slice(0, newCount);
            }
            return newNames;
        });
    };

    // Mock Data Generators
    const mockNextActions: ChecklistStatus[] = [
        {
            id: '1',
            completed_at: null,
            checklist_items: { id: 'c1', title: 'Complete Business Profile', description: 'Add your business address and tax ID.' },
            statuses: { name: 'in_progress' }
        },
        {
            id: '2',
            completed_at: null,
            checklist_items: { id: 'c2', title: 'Connect Bank Account', description: 'Link your primary business checking account.' },
            statuses: { name: 'pending' }
        },
        {
            id: '3',
            completed_at: null,
            checklist_items: { id: 'c3', title: 'Upload Articles of Incorporation', description: 'Required for legal compliance.' },
            statuses: { name: 'pending' }
        }
    ];

    const mockRecentWins: ChecklistStatus[] = [
        {
            id: '4',
            completed_at: new Date().toISOString(),
            checklist_items: { id: 'c4', title: 'Account Created', description: null },
            statuses: { name: 'complete' }
        }
    ];

    const installedModules = MARKETPLACE_MODULES.filter(m => installedModuleIds.has(m.id));

    const toggleModule = (moduleId: string) => {
        const newSet = new Set(installedModuleIds);
        if (newSet.has(moduleId)) {
            newSet.delete(moduleId);
        } else {
            newSet.add(moduleId);
        }
        setInstalledModuleIds(newSet);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.40))] group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-display tracking-tight">Test Member Dashboard</h1>
                    <p className="text-muted-foreground">Simulate the member experience and verify module integrations.</p>
                </div>
                <Button variant="outline" onClick={() => {
                    setProgress([35]);
                    setInstalledModuleIds(new Set());
                    setMemberStage('new');
                    setEmployeeCount(1);
                    setEmployeeNames(['Test User']);
                }}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Simulation
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full overflow-hidden">
                {/* Control Panel */}
                <Card className="h-full flex flex-col overflow-hidden border-dashed border-2">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Settings2 className="w-5 h-5" />
                            Simulation Controls
                        </CardTitle>
                        <CardDescription>Adjust the simulated state</CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <CardContent className="space-y-6 pt-6">

                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member Context</Label>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="stage-toggle">Stage: {memberStage === 'new' ? 'Startup' : 'Established'}</Label>
                                    <Switch
                                        id="stage-toggle"
                                        checked={memberStage === 'existing'}
                                        onCheckedChange={(c) => setMemberStage(c ? 'existing' : 'new')}
                                    />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="employee-count" className="text-sm">Current Employees</Label>
                                        <Input
                                            id="employee-count"
                                            type="number"
                                            min={1}
                                            value={employeeCount}
                                            onChange={(e) => handleEmployeeCountChange(parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    <div className="space-y-2 pl-2 border-l-2 pt-1 animate-in fade-in slide-in-from-top-1">
                                        {Array.from({ length: employeeCount }).map((_, i) => (
                                            <div key={i} className="space-y-1">
                                                <Label htmlFor={`emp-name-${i}`} className="text-xs text-muted-foreground">
                                                    {i === 0 && employeeCount === 1 ? "User's Name" : `Employee ${i + 1}`}
                                                </Label>
                                                <Input
                                                    id={`emp-name-${i}`}
                                                    value={employeeNames[i] || ''}
                                                    onChange={(e) => {
                                                        const newNames = [...employeeNames];
                                                        newNames[i] = e.target.value;
                                                        setEmployeeNames(newNames);
                                                    }}
                                                    placeholder={i === 0 ? "Enter name..." : `Name for Employee ${i + 1}`}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-[10px] text-muted-foreground pt-1">
                                        Assign tasks to these simulated members.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Progress */}
                            <div className="space-y-4">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progression ({progress[0]}%)</Label>
                                <Slider
                                    value={progress}
                                    onValueChange={setProgress}
                                    max={100}
                                    step={5}
                                />
                            </div>

                            <Separator />

                            {/* Modules */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Installed Modules</Label>
                                    <span className="text-xs text-muted-foreground">{installedModuleIds.size} active</span>
                                </div>

                                <div className="space-y-3">
                                    {MARKETPLACE_MODULES.map(module => (
                                        <div key={module.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="space-y-0.5">
                                                <Label htmlFor={`mod-${module.id}`} className="text-sm font-medium cursor-pointer">
                                                    {module.title}
                                                </Label>
                                                <p className="text-[10px] text-muted-foreground">{module.category}</p>
                                            </div>
                                            <Switch
                                                id={`mod-${module.id}`}
                                                checked={installedModuleIds.has(module.id)}
                                                onCheckedChange={() => toggleModule(module.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Preview Area */}
                <div className="xl:col-span-3 h-full overflow-y-auto bg-muted/10 rounded-xl border-2 border-primary/20 relative">
                    <div className="absolute top-0 inset-x-0 h-8 bg-primary/10 border-b border-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            <LayoutDashboard className="w-3 h-3" />
                            Live Preview Mode
                        </span>
                    </div>
                    <div className="p-8 pt-12">
                        <MemberDashboardUI
                            businessName="Acme Corp (Simulated)"
                            memberStage={memberStage}
                            trackLabel={memberStage === 'new' ? "🌱 Foundation Track" : "🚀 Optimization Track"}
                            progress={progress[0]}
                            completedItems={Math.round((progress[0] / 100) * 10)}
                            totalItems={10}
                            nextActions={mockNextActions}
                            recentWins={mockRecentWins}
                            installedModules={installedModules}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
