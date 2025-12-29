"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';

interface PeopleAnalyticsProps {
    stats?: {
        total: number;
        active: number;
        onLeave: number;
        turnoverRisk: number;
    };
    isLoading?: boolean;
}

export function PeopleAnalytics({ stats, isLoading }: PeopleAnalyticsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-blue-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total Employees</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.total || 0}</h3>
                        <div className="flex items-center mt-1 text-green-600 text-xs font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" /> Stable
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Active</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.active || 0}</h3>
                        <div className="flex items-center mt-1 text-green-600 text-xs font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" /> Growth
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                        <PieChartIcon className="h-5 w-5 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-orange-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">On Leave</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.onLeave || 0}</h3>
                        <div className="flex items-center mt-1 text-gray-500 text-xs font-medium">
                            --
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Turnover Risk</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.turnoverRisk || 0}</h3>
                        <div className="flex items-center mt-1 text-red-600 text-xs font-medium">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Attention
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
