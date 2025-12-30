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
import { createAccount, getAccounts } from "@/actions/financial-controls";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateAccount, deleteAccount } from "@/actions/financial-controls";

interface Step2Props {
    onSave: () => void;
}

const formSchema = z.object({
    id: z.string().optional(),
    account_name: z.string().min(1, "Account name is required"),
    account_type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense', 'Bank', 'Other Current Asset', 'Fixed Asset', 'Accounts Payable', 'Other Current Liability', 'Cost of Goods Sold', 'Income']),
    detail_type: z.string().optional(),
    account_number: z.string().optional(),
    description: z.string().optional(),
});

export function Step2Accounts({ onSave }: Step2Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    // Edit Dialog State
    const [editingAccount, setEditingAccount] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit Form
    const editForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            account_name: "",
            account_type: "Expense",
            account_number: "",
        },
    });

    const loadAccounts = async () => {
        const data = await getAccounts();
        if (data) setAccounts(data);
    };

    useEffect(() => {
        loadAccounts();
        // Load templates
        import("@/actions/financial-controls").then(({ getCoaTemplates }) => {
            getCoaTemplates().then(data => {
                if (data) setTemplates(data);
            });
        });
    }, []);

    const openEdit = (account: any) => {
        setEditingAccount(account);
        editForm.reset({
            id: account.id,
            account_name: account.account_name,
            account_number: account.account_number,
            account_type: account.account_type,
            detail_type: account.detail_type,
            description: account.description
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!editingAccount) return;
        setIsSavingEdit(true);
        try {
            // Need to cast because formSchema id is optional but update requires it
            await updateAccount({ ...values, id: editingAccount.id });
            toast.success("Account updated");
            setEditDialogOpen(false);
            loadAccounts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update account");
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDelete = async () => {
        if (!editingAccount) return;
        setIsDeleting(true);
        try {
            await deleteAccount(editingAccount.id);
            toast.success("Account deleted");
            setEditDialogOpen(false);
            loadAccounts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    async function handleImport() {
        if (!selectedTemplate) return;
        setIsLoading(true);
        try {
            const { importCoaTemplate } = await import("@/actions/financial-controls");
            const result = await importCoaTemplate(selectedTemplate);
            if (result && result.count > 0) {
                toast.success(`Imported ${result.count} accounts`);
                loadAccounts();
                onSave();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to import template");
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await createAccount(values);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success("Account added");
            form.reset();
            loadAccounts();
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add account");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chart of Accounts</CardTitle>
                <CardDescription>Add key accounts to track or import a standard template.</CardDescription>

                <div className="flex items-center gap-4 mt-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Import Template</label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an industry template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="pt-6">
                        <Button
                            variant="secondary"
                            onClick={handleImport}
                            disabled={isLoading || !selectedTemplate}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Import Accounts
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end border-b pb-6">
                        <FormField
                            control={form.control}
                            name="account_name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Office Rent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="account_number"
                            render={({ field }) => (
                                <FormItem className="w-32">
                                    <FormLabel>Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="6000" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="account_type"
                            render={({ field }) => (
                                <FormItem className="w-40">
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Asset">Asset</SelectItem>
                                            <SelectItem value="Liability">Liability</SelectItem>
                                            <SelectItem value="Equity">Equity</SelectItem>
                                            <SelectItem value="Revenue">Revenue</SelectItem>
                                            <SelectItem value="Expense">Expense</SelectItem>
                                            <SelectItem value="Bank">Bank</SelectItem>
                                            <SelectItem value="Other Current Asset">Other Current Asset</SelectItem>
                                            <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                                            <SelectItem value="Accounts Payable">Accounts Payable</SelectItem>
                                            <SelectItem value="Other Current Liability">Other Current Liability</SelectItem>
                                            <SelectItem value="Cost of Goods Sold">Cost of Goods Sold</SelectItem>
                                            <SelectItem value="Income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </form>
                </Form>

                <div className="border rounded-md max-h-[400px] overflow-y-auto">
                    <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 font-medium text-sm sticky top-0">
                        <div className="col-span-2">Number</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-3">Type</div>
                        <div className="col-span-2">Detail</div>
                    </div>
                    {accounts.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">No accounts added yet.</div>
                    ) : (
                        accounts.map((acc) => (
                            <div
                                key={acc.id}
                                className="grid grid-cols-12 gap-4 p-3 border-t text-sm items-center hover:bg-muted/20 cursor-pointer group"
                                onClick={() => openEdit(acc)}
                            >
                                <div className="col-span-2 font-mono text-muted-foreground group-hover:text-primary transition-colors">{acc.account_number || "-"}</div>
                                <div className="col-span-5 font-medium group-hover:text-primary transition-colors">{acc.account_name}</div>
                                <div className="col-span-3">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs truncate block w-fit">
                                        {acc.account_type}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs text-muted-foreground truncate" title={acc.detail_type}>
                                    {acc.detail_type || "-"}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Account</DialogTitle>
                            <DialogDescription>Modify account details or remove it.</DialogDescription>
                        </DialogHeader>
                        <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                                <FormField
                                    control={editForm.control}
                                    name="account_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="account_number"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={editForm.control}
                                        name="account_type"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Asset">Asset</SelectItem>
                                                        <SelectItem value="Liability">Liability</SelectItem>
                                                        <SelectItem value="Equity">Equity</SelectItem>
                                                        <SelectItem value="Revenue">Revenue</SelectItem>
                                                        <SelectItem value="Expense">Expense</SelectItem>
                                                        <SelectItem value="Bank">Bank</SelectItem>
                                                        <SelectItem value="Other Current Asset">Other Current Asset</SelectItem>
                                                        <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                                                        <SelectItem value="Accounts Payable">Accounts Payable</SelectItem>
                                                        <SelectItem value="Other Current Liability">Other Current Liability</SelectItem>
                                                        <SelectItem value="Cost of Goods Sold">Cost of Goods Sold</SelectItem>
                                                        <SelectItem value="Income">Income</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={editForm.control}
                                    name="detail_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Detail Type (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g. Cash on hand" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="gap-2 sm:justify-between">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={isDeleting || isSavingEdit}
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                        Delete
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setEditDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSavingEdit || isDeleting}>
                                            {isSavingEdit && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
