"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCloseItem, getCloseItems } from "@/actions/financial-controls";
import { toast } from "sonner";
import { Check, Loader2, Plus } from "lucide-react";

interface Step3Props {
    onSave: () => void;
}

const formSchema = z.object({
    id: z.string().optional(),
    task_name: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'complete']).default('pending'),
    due_day: z.number().optional(),
    assigned_to: z.string().optional(),
});

export function Step3CloseItems({ onSave }: Step3Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            task_name: "",
            due_day: 5,
        },
    });

    const loadItems = async () => {
        const data = await getCloseItems();
        if (data) setItems(data);
    };

    useEffect(() => {
        loadItems();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await createCloseItem(values);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success("Task added");
            form.reset();
            loadItems();
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Close Checklist</CardTitle>
                <CardDescription>Define tasks to complete each month to close the books.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end">
                        <FormField
                            control={form.control}
                            name="task_name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Task</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Reconcile Bank Accounts" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="due_day"
                            render={({ field }) => (
                                <FormItem className="w-32">
                                    <FormLabel>Due Day</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="5" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </form>
                </Form>

                <div className="space-y-2">
                    {items.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm border rounded-md border-dashed">No tasks added yet.</div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{item.task_name}</p>
                                        <p className="text-xs text-muted-foreground">Due: Day {item.due_day}</p>
                                    </div>
                                </div>
                                <div className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                                    {item.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
