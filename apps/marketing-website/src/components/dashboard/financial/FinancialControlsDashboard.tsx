"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFinancialSettings, getAccounts, getCloseItems } from "@/actions/financial-controls";
import { DollarSign, ListChecks, PieChart, Activity } from "lucide-react";

export function FinancialControlsDashboard() {
    const [settings, setSettings] = useState<any>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [closeItems, setCloseItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, a, c] = await Promise.all([
                getFinancialSettings(),
                getAccounts(),
                getCloseItems()
            ]);
            setSettings(s);
            setAccounts(a || []);
            setCloseItems(c || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    const completedItems = closeItems.filter(i => i.status === 'complete').length;
    const progress = closeItems.length > 0 ? (completedItems / closeItems.length) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reporting Currency</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{settings?.reporting_currency || "USD"}</div>
                        <p className="text-xs text-muted-foreground">Basis: {settings?.accounting_method || "Accrual"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accounts.length}</div>
                        <p className="text-xs text-muted-foreground">Chart of Accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Closing Checklist</CardTitle>
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">{completedItems} of {closeItems.length} tasks completed</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Accounts Watchlist</CardTitle>
                        <CardDescription>Key accounts monitored</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accounts.slice(0, 5).map(acc => (
                                <div key={acc.id} className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{acc.account_name}</p>
                                        <p className="text-xs text-muted-foreground">{acc.account_type}</p>
                                    </div>
                                    <div className="font-mono text-sm">{acc.account_number || "-"}</div>
                                </div>
                            ))}
                            {accounts.length === 0 && <p className="text-sm text-muted-foreground">No accounts.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Monthly Close Tasks</CardTitle>
                        <CardDescription>Upcoming deadlines</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {closeItems.slice(0, 5).map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                        <p className="text-sm font-medium leading-none">{item.task_name}</p>
                                    </div>
                                    <Badge variant={item.status === 'complete' ? 'default' : 'outline'}>
                                        Day {item.due_day}
                                    </Badge>
                                </div>
                            ))}
                            {closeItems.length === 0 && <p className="text-sm text-muted-foreground">No tasks.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
