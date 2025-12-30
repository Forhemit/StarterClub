"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrUpdateFinancialSettings, getFinancialSettings, resetFinancialData } from "@/actions/financial-controls";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Step1Props {
    onSave: (id: string) => void;
}

const formSchema = z.object({
    id: z.string().optional(),
    reporting_currency: z.string().default('USD'),
    fiscal_year_end: z.string().default('12-31'),
    accounting_method: z.enum(['cash', 'accrual']).default('accrual'),
});

export function Step1Settings({ onSave }: Step1Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

    // Reset State
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            reporting_currency: "USD",
            fiscal_year_end: "12-31",
            accounting_method: "accrual",
        },
    });

    useEffect(() => {
        setIsMounted(true);
        const load = async () => {
            const data = await getFinancialSettings();
            if (data) {
                form.reset(data);
            }
        };
        load();
    }, [form]);

    // Auto-save debounced
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (type === 'change') {
                setStatus("saving");
                const handler = setTimeout(() => {
                    form.handleSubmit(onSubmit)();
                }, 1000);
                return () => clearTimeout(handler);
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await createOrUpdateFinancialSettings(values);
            if (result.error) {
                toast.error(result.error);
                setStatus("idle");
                return;
            }
            if (result.id) {
                setStatus("saved");
                onSave(result.id);
                setTimeout(() => setStatus("idle"), 2000);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
            setStatus("idle");
        }
    }

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetFinancialData();
            toast.success("Financial data reset");
            form.reset({
                reporting_currency: "USD",
                fiscal_year_end: "12-31",
                accounting_method: "accrual",
            });
            setResetDialogOpen(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset data");
        } finally {
            setIsResetting(false);
        }
    };

    if (!isMounted) {
        return <Card>
            <CardHeader>
                <CardTitle>Financial Settings</CardTitle>
                <CardDescription>Configure your basic financial reporting preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </CardContent>
        </Card>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Financial Settings</CardTitle>
                    <CardDescription>Configure your basic financial reporting preferences.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                    {status === "saving" && <span className="text-xs text-muted-foreground flex items-center"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...</span>}
                    {status === "saved" && <span className="text-xs text-green-600 font-medium">Saved</span>}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setResetDialogOpen(true)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Reset all financial data"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reporting_currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reporting Currency</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="USD" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fiscal_year_end"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fiscal Year End (MM-DD)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="12-31" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="accounting_method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accounting Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="accrual">Accrual</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {form.watch("accounting_method") === "accrual" && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            <strong>Accrual Method:</strong> Revenue and expenses are recorded when they are earned or incurred, regardless of when the money is actually received or paid. This provides a more accurate picture of long-term financial health.
                                        </p>
                                    )}
                                    {form.watch("accounting_method") === "cash" && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            <strong>Cash Method:</strong> Revenue and expenses are recorded only when cash is actually received or paid. This is simpler and gives a clear picture of cash flow but may not reflect future obligations.
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reset Financial Data?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete your financial settings, charts of accounts, and close items. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setResetDialogOpen(false)} disabled={isResetting}>Cancel</Button>
                            <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
                                {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reset Everything
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
