"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, Building2, Briefcase, Calendar, Users, Badge } from "lucide-react";
import { toast } from "sonner";

interface EmploymentTabProps {
    profile: any;
}

const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "product", label: "Product" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "Human Resources" },
];

export function EmploymentTab({ profile }: EmploymentTabProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: profile?.job_title || "",
        department: profile?.department || "",
        employeeId: profile?.employee_id || "EMP-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        startDate: profile?.start_date || "",
        manager: profile?.manager || "",
        emergencyContact: profile?.emergency_contact || "",
        emergencyPhone: profile?.emergency_phone || "",
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement employee profile update action
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Employment details updated successfully");
        } catch (error) {
            toast.error("Failed to update employment details");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Job Information */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Job Information
                    </CardTitle>
                    <CardDescription>Your role and department within the organization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="employeeId" className="flex items-center gap-2">
                                <Badge className="h-3.5 w-3.5" />
                                Employee ID
                            </Label>
                            <Input
                                id="employeeId"
                                value={formData.employeeId}
                                disabled
                                className="bg-muted font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input
                                id="jobTitle"
                                placeholder="e.g., Senior Developer"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department" className="flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5" />
                                Department
                            </Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="manager" className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            Reporting Manager
                        </Label>
                        <Input
                            id="manager"
                            placeholder="Manager's name"
                            value={formData.manager}
                            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Emergency Contact</CardTitle>
                    <CardDescription>Who should we contact in case of emergency?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Contact Name</Label>
                            <Input
                                id="emergencyContact"
                                placeholder="Full name"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Contact Phone</Label>
                            <Input
                                id="emergencyPhone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.emergencyPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
