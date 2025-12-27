"use client";

import React from 'react';
import { SuperAdminDashboard } from './SuperAdminDashboard';

export function EmployeeDashboard() {
    return (
        <div className="space-y-6">
            <div className="bg-amber-100 p-4 rounded-md border border-amber-200 text-amber-800 text-sm">
                <strong>Employee Mode:</strong> You are viewing the internal administration dashboard.
            </div>
            <SuperAdminDashboard />
        </div>
    );
}
