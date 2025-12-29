"use client";

import React from 'react';
import { EmployeeFormData } from '../page';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface StepProps {
    data: EmployeeFormData;
}

export default function Step4Review({ data }: StepProps) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <p>Unless you edit, we will proceed with creating this employee profile and triggering the automated onboarding email sequence.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Employee</h4>
                    <p className="font-medium text-lg">{data.firstName} {data.lastName}</p>
                    <p className="text-gray-500">{data.jobTitle}</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Contact</h4>
                    <p className="font-medium">{data.email}</p>
                    <p className="text-gray-500 text-sm">{data.emailGenerated}</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Department</h4>
                    {/* Note: We only have ID here, real app would show name. For summary, ID/Placeholder is acceptable for MVP, or we pass Dept Name from parent state map */}
                    <p className="font-medium">Department ID: {data.departmentId}</p>
                    <p className="text-gray-500 text-sm">Start Date: {data.startDate}</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">System Access</h4>
                    <p className="font-medium capitalize">{data.accessLevel} Level</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {data.selectedTools.map(tool => (
                            <span key={tool} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 border">{tool}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
