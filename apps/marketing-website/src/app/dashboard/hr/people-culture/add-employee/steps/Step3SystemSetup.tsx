"use client";

import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeFormData } from '../page';
import { Laptop, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface StepProps {
    data: EmployeeFormData;
    updateData: (data: Partial<EmployeeFormData>) => void;
}

export default function Step3SystemSetup({ data, updateData }: StepProps) {

    // Auto-generate email based on name
    useEffect(() => {
        if (data.firstName && data.lastName && !data.emailGenerated) {
            const generated = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@company.com`;
            updateData({ emailGenerated: generated });
        }
    }, [data.firstName, data.lastName, data.emailGenerated, updateData]);

    const toggleTool = (tool: string) => {
        const current = data.selectedTools || [];
        const newTools = current.includes(tool)
            ? current.filter(t => t !== tool)
            : [...current, tool];
        updateData({ selectedTools: newTools });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">

            {/* Email Provisioning */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Laptop className="h-4 w-4" /> Account Provisioning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="genEmail">Corporate Email</Label>
                        <Input
                            id="genEmail"
                            value={data.emailGenerated}
                            onChange={(e) => updateData({ emailGenerated: e.target.value })}
                            className="bg-gray-50"
                        />
                        <p className="text-[10px] text-green-600 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Available
                        </p>
                    </div>
                </div>
            </div>

            {/* Tools Access */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    Software & Tools
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {['G-Suite', 'Slack', 'Jira', 'Notion', 'Figma', 'GitHub', 'AWS'].map(tool => (
                        <div key={tool} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors">
                            <Checkbox
                                id={`tool-${tool}`}
                                checked={data.selectedTools?.includes(tool)}
                                onCheckedChange={() => toggleTool(tool)}
                            />
                            <Label htmlFor={`tool-${tool}`} className="cursor-pointer flex-1">{tool}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Access Level */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Shield className="h-4 w-4" /> Access Level
                </h3>
                <div className="space-y-2">
                    {['standard', 'admin', 'readonly'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`level-${level}`}
                                name="accessLevel"
                                value={level}
                                checked={data.accessLevel === level}
                                onChange={(e) => updateData({ accessLevel: e.target.value })}
                                className="h-4 w-4 border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                            />
                            <Label htmlFor={`level-${level}`} className="capitalize cursor-pointer">{level} User</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
