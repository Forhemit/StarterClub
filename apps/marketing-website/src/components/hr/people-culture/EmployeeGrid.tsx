"use client";

import React, { useState } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { EmployeeStatus } from './StatusBadge';
import { useRouter } from 'next/navigation';

export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    title: string;
    department: string;
    status: EmployeeStatus;
    location?: string;
    hire_date: string;
    engagement_score?: number;
    tenure_days?: number;
    avatar_url?: string;
}

interface EmployeeGridProps {
    employees: Employee[];
    isLoading?: boolean;
}

export function EmployeeGrid({ employees, isLoading }: EmployeeGridProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const router = useRouter();

    const handleViewProfile = (id: string) => {
        router.push(`/dashboard/hr/people-culture/employee/${id}`);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Employees <span className="text-gray-400 font-normal ml-1">({employees.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="h-7 w-7 p-0"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="h-7 w-7 p-0"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                    </Button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {employees.map(emp => (
                        <EmployeeCard
                            key={emp.id}
                            employee={emp}
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-md border bg-white">
                    <div className="p-4 text-center text-gray-500">Table view coming soon...</div>
                </div>
            )}
        </div>
    );
}
