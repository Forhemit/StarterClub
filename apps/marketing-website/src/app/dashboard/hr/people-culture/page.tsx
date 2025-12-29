"use client";

import React from 'react';
import { AdvancedFilters } from '@/components/hr/people-culture/AdvancedFilters';
import { EmployeeGrid, Employee } from '@/components/hr/people-culture/EmployeeGrid';
import { PeopleAnalytics } from '@/components/hr/people-culture/PeopleAnalytics';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { getEmployees, getPeopleStats, EmployeeFilter } from '@/actions/people-culture';

export default function PeopleCulturePage() {
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [stats, setStats] = React.useState<any>({});
    const [loading, setLoading] = React.useState(true);
    const [filters, setFilters] = React.useState<EmployeeFilter>({});

    React.useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            setLoading(true);
            try {
                const [emps, st] = await Promise.all([
                    getEmployees(filters),
                    getPeopleStats()
                ]);
                if (mounted) {
                    setEmployees(emps);
                    setStats(st);
                }
            } catch (e) {
                console.error("Failed to load HR data", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadData();
        return () => { mounted = false; };
    }, [filters]);

    return (
        <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-50/50">
            {/* Header */}
            <div className="flex-none px-8 py-6 bg-white border-b flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">People & Culture</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your team, track engagement, and foster culture.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Link href="/dashboard/hr/people-culture/add-employee">
                        <Button className="bg-[#FF6B35] hover:bg-[#E85A2D] text-white shadow-md hover:shadow-lg transition-all">
                            <Plus className="h-4 w-4 mr-2" /> Add Employee
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col p-8 pt-6 gap-6 max-w-[1600px] mx-auto w-full">

                    {/* Analytics Section */}
                    <div className="flex-none">
                        <PeopleAnalytics stats={stats} isLoading={loading} />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-1 gap-6 min-h-0">
                        {/* Sidebar Filters */}
                        <AdvancedFilters
                            departments={['Engineering', 'Sales', 'Marketing', 'Design', 'Operations', 'Finance', 'HR']}
                            locations={['New York', 'London', 'Berlin', 'Remote', 'San Francisco', 'Tokyo']}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                        />

                        {/* Grid/Table Area */}
                        <div className="flex-1 overflow-y-auto pr-1">
                            <EmployeeGrid employees={employees} isLoading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
