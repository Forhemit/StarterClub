"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "../../ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AdvancedFiltersProps {
    onFilterChange: (filters: any) => void;
    departments: string[];
    locations: string[];
}

export function AdvancedFilters({ onFilterChange, departments, locations }: AdvancedFiltersProps) {
    const [tenureRange, setTenureRange] = React.useState([0, 10]);
    const [selectedDepts, setSelectedDepts] = React.useState<string[]>([]);

    const handleDepartmentToggle = (dept: string) => {
        setSelectedDepts(prev =>
            prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
        );
        // Trigger filter change...
    };

    return (
        <Card className="h-full border-r rounded-none border-l-0 border-y-0 shadow-none bg-gray-50/50 w-full max-w-xs hidden lg:block">
            <CardHeader className="pb-3 border-b bg-white">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        Clear all
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 overflow-y-auto max-h-[calc(100vh-200px)]">

                {/* Search */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Name, role, or ID" className="pl-9 bg-white" />
                    </div>
                </div>

                <Separator />

                {/* Status */}
                <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Employment Status</Label>
                    <div className="space-y-2">
                        {['Active', 'Inactive', 'On Leave', 'Terminated'].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                                <Checkbox id={`status-${status}`} />
                                <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">{status}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Department */}
                <div className="space-y-3">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Department</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {departments.map((dept) => (
                            <div key={dept} className="flex items-center space-x-2">
                                <Checkbox id={`dept-${dept}`} />
                                <Label htmlFor={`dept-${dept}`} className="font-normal cursor-pointer text-sm truncate">{dept}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Tenure Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Tenure (Years)</Label>
                        <span className="text-xs text-gray-500 font-medium">{tenureRange[0]} - {tenureRange[1]}+ yrs</span>
                    </div>
                    <Slider
                        defaultValue={[0, 10]}
                        max={10}
                        step={1}
                        className="py-4"
                        onValueChange={setTenureRange}
                    />
                </div>

                <Separator />

                {/* Saved Filters */}
                <div className="pt-2">
                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                        <Save className="h-4 w-4" /> Save Current Filter
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
