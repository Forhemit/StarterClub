"use client";

import { useEffect, useState } from "react";
import { Check, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailableDepartments, assignUserDepartment } from "@/actions/rbac";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Department {
    id: string;
    department_name: string;
    department_code: string;
    description: string;
}

interface DepartmentSelectorProps {
    userId: string;
    onComplete?: () => void;
}

export function DepartmentSelector({ userId, onComplete }: DepartmentSelectorProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function load() {
            try {
                const data = await getAvailableDepartments();
                setDepartments(data);
            } catch (e) {
                console.error("Failed to load departments", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleConfirm = async () => {
        if (!selectedDeptId) return;
        setSubmitting(true);
        try {
            await assignUserDepartment(userId, selectedDeptId);
            toast({
                title: "Department Assigned",
                description: "Welcome to the team!",
            });
            if (onComplete) {
                onComplete();
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to assign department.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading departments...</div>;
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-3xl font-display uppercase tracking-tight">Select Your Department</CardTitle>
                <CardDescription>
                    Choose the primary department you belong to. This will customize your dashboard experience.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    return (
                        <div
                            key={dept.id}
                            onClick={() => setSelectedDeptId(dept.id)}
                            className={cn(
                                "cursor-pointer rounded-lg border p-4 transition-all hover:bg-muted/50",
                                isSelected ? "border-primary bg-muted ring-1 ring-primary" : "border-border"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        {dept.department_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {dept.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
                <Button
                    onClick={handleConfirm}
                    disabled={!selectedDeptId || submitting}
                    className="w-full md:w-auto gap-2"
                >
                    {submitting ? "Joining..." : "Confirm & Continue"}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
