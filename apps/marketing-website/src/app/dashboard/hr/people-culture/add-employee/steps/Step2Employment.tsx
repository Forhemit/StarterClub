"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeFormData } from '../page';
import { Briefcase, Calendar as CalendarIcon, Building } from 'lucide-react';
import { getDepartments } from '@/actions/people-culture';

interface StepProps {
    data: EmployeeFormData;
    updateData: (data: Partial<EmployeeFormData>) => void;
}

export default function Step2Employment({ data, updateData }: StepProps) {
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        // Fetch departments from server action
        getDepartments().then(setDepartments);
    }, []);

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                        value={data.departmentId}
                        onValueChange={(val) => updateData({ departmentId: val })}
                    >
                        <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.length > 0 ? departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>{dept.department_name}</SelectItem>
                            )) : (
                                <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="jobTitle"
                        value={data.jobTitle}
                        onChange={(e) => updateData({ jobTitle: e.target.value })}
                        placeholder="e.g. Senior Product Designer"
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="startDate"
                        type="date"
                        value={data.startDate}
                        onChange={(e) => updateData({ startDate: e.target.value })}
                        className="pl-9"
                    />
                </div>
                <p className="text-[10px] text-gray-500">We will schedule onboarding sessions starting from this date.</p>
            </div>
        </div>
    );
}
