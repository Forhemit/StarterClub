'use client';

import React, { useState } from 'react';
import { Database } from '@starter-club/shared-types';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@starter-club/ui';

type Role = Database['public']['Tables']['roles']['Row'];

export function RolesList({ initialRoles }: { initialRoles: Role[] }) {
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const supabase = useSupabase();

    const refreshRoles = async () => {
        const { data } = await supabase.from('roles').select('*').order('name');
        if (data) setRoles(data);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">System Roles</h2>
                <Button onClick={() => alert('Add Role - Not implemented yet')}>
                    Add Role
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{role.name}</h3>
                                <p className="text-sm text-gray-500 font-mono">{role.slug}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {role.description || 'No description provided.'}
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`Edit ${role.name}`)}>
                                Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
