'use client';

import React from 'react';
import { Database } from '@starter-club/shared-types';

type Permission = Database['public']['Tables']['permissions']['Row'];

export function PermissionsList({ permissions }: { permissions: Permission[] }) {
    // Group permissions by category for better display
    const grouped = permissions.reduce((acc, perm) => {
        const cat = perm.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([category, perms]) => (
                <div key={category} className="border rounded-lg p-4 bg-white">
                    <h3 className="text-lg font-bold capitalize mb-3 border-b pb-2">
                        {category.replace('_', ' ')}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {perms.map((perm) => (
                            <div key={perm.id} className="p-3 bg-gray-50 rounded border text-sm">
                                <div className="font-medium text-blue-700">
                                    {perm.action.toUpperCase()}
                                </div>
                                <div className="text-gray-900 font-semibold truncate">
                                    {perm.resource}
                                </div>
                                <div className="text-gray-500 text-xs mt-1">
                                    {perm.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
