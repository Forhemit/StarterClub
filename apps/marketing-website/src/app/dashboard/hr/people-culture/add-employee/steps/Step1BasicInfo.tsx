"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmployeeFormData } from '../page';
import { Mail, User, Phone } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface StepProps {
    data: EmployeeFormData;
    updateData: (data: Partial<EmployeeFormData>) => void;
}

export default function Step1BasicInfo({ data, updateData }: StepProps) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="firstName"
                            value={data.firstName}
                            onChange={(e) => updateData({ firstName: e.target.value })}
                            placeholder="e.g. Jane"
                            className="pl-9"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="lastName"
                            value={data.lastName}
                            onChange={(e) => updateData({ lastName: e.target.value })}
                            placeholder="e.g. Doe"
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Personal Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData({ email: e.target.value })}
                        placeholder="jane.doe@personal.com"
                        className="pl-9"
                    />
                </div>
                <p className="text-[10px] text-gray-500">We will use this to send the initial onboarding invitation.</p>
            </div>

            <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                    id="sendInvite"
                    checked={data.sendInvite}
                    onCheckedChange={(checked) => updateData({ sendInvite: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor="sendInvite"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Send onboarding invitation immediately
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                        If unchecked, you can send the invitation later from their profile.
                    </p>
                </div>
            </div>

            {/* Optional: Avatar Upload could go here */}
        </div>
    );
}
