"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createCandidate, getDepartments } from "./actions";
import { CandidateSource } from "@/types/hr/interview-history/types";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    positionApplied: z.string().min(2, "Position is required"),
    departmentId: z.string().optional(),
    source: z.string().optional(),
    resumeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const SOURCES: { value: CandidateSource; label: string }[] = [
    { value: "referral", label: "Referral" },
    { value: "job_board", label: "Job Board" },
    { value: "website", label: "Company Website" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "recruiter", label: "Recruiter" },
    { value: "career_fair", label: "Career Fair" },
    { value: "internal", label: "Internal" },
    { value: "other", label: "Other" },
];

interface AddCandidateDialogProps {
    onSuccess?: () => void;
}

export function AddCandidateDialog({ onSuccess }: AddCandidateDialogProps) {
    const [open, setOpen] = useState(false);
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            linkedinUrl: "",
            positionApplied: "",
            departmentId: "",
            source: "website",
            resumeUrl: "",
        },
    });

    useEffect(() => {
        if (open) {
            fetchDepartments();
        }
    }, [open]);

    async function fetchDepartments() {
        setLoadingDepartments(true);
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to load departments", error);
            toast({
                title: "Error",
                description: "Failed to load departments",
                variant: "destructive",
            });
        } finally {
            setLoadingDepartments(false);
        }
    }

    async function onSubmit(values: FormValues) {
        try {
            await createCandidate({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone || undefined,
                linkedinUrl: values.linkedinUrl || undefined,
                positionApplied: values.positionApplied,
                departmentId: values.departmentId === "none" ? undefined : values.departmentId || undefined,
                source: (values.source as CandidateSource) || undefined,
                resumeUrl: values.resumeUrl || undefined,
            });

            toast({
                title: "Success",
                description: "Candidate added successfully",
            });

            setOpen(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to create candidate", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create candidate",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Plus className="h-4 w-4" />
                    Add Candidate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Candidate</DialogTitle>
                    <DialogDescription>
                        Manually add a candidate to the tracking pipeline.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john.doe@example.com" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 (555) 000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="positionApplied"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position Applied</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Senior Software Engineer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">No Department</SelectItem>
                                                {loadingDepartments ? (
                                                    <div className="flex items-center justify-center p-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : (
                                                    departments.map((dept) => (
                                                        <SelectItem key={dept.id} value={dept.id}>
                                                            {dept.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {SOURCES.map((source) => (
                                                    <SelectItem key={source.value} value={source.value}>
                                                        {source.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resumeUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resume URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Candidate
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
