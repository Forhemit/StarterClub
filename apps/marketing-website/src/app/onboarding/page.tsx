'use client';

import { useState, useEffect, useTransition } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import RoleTimeline from '@/components/RoleTimeline';
import { completeOnboarding, skipOnboarding } from './actions';
import { toast } from '@/hooks/use-toast';

// Available roles with descriptions
const AVAILABLE_ROLES = [
    { slug: 'member', name: 'Member', description: 'Regular platform member with access to community features' },
    { slug: 'partner', name: 'Partner', description: 'Business partner with collaboration tools' },
    { slug: 'sponsor', name: 'Sponsor', description: 'Sponsor with visibility and recognition' },
    { slug: 'employee', name: 'Employee', description: 'Company employee with internal tools' },
    { slug: 'super_admin', name: 'Super Admin', description: 'Full system access (restricted)' },
    { slug: 'admin', name: 'Admin', description: 'System administration privileges' },
    { slug: 'manager', name: 'Manager', description: 'Team management capabilities' },
    { slug: 'guest', name: 'Guest', description: 'Limited access for visitors' },
];

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<any>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [primaryRole, setPrimaryRole] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [roleHistory, setRoleHistory] = useState<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const initAndLoad = async () => {
            try {
                const token = await getToken({ template: 'supabase' });

                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        global: {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    }
                );

                await Promise.all([
                    loadDepartments(supabase),
                    loadUserData(supabase, userId)
                ]);

            } catch (error) {
                console.error("Failed to initialize data:", error);
                toast({
                    title: "Error loading data",
                    description: "Please refresh the page.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        initAndLoad();
    }, [isLoaded, userId, getToken]);

    const loadDepartments = async (supabase: SupabaseClient) => {
        try {
            const { data, error } = await supabase.from('departments').select('*').order('department_name');
            if (error) throw error;
            if (data) setDepartments(data);
        } catch (e) {
            console.error("Error loading departments", e);
        }
    };

    const loadUserData = async (supabase: SupabaseClient, uid: string) => {
        try {
            // Load profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            setProfile(profileData);

            // Load current roles
            // Replaces RoleService.getUserActiveRoles
            const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('role_slug')
                .eq('clerk_user_id', uid)
                .eq('is_active', true);

            if (rolesError) throw rolesError;

            const activeRoles = rolesData?.map((r: any) => r.role_slug) || [];
            setSelectedRoles(activeRoles);

            // Load current departments
            const { data: userDepts } = await supabase
                .from('user_departments')
                .select('department_id')
                .eq('user_id', uid);
            // .eq('status', 'active'); // status might not exist on user_departments table based on schema check earlier? 
            // Schema check: user_departments has is_primary, created_at. Migration `20251230000006_user_departments.sql` didn't show status.
            // Migration `20251228000000_enhanced_rbac.sql` doesn't define it either.
            // Assuming status column MIGHT NOT EXIST or is inferred.
            // Warning: `status` column was used in previous code. I will check schema if possible, but safer to omit if unsure.
            // The previous code used `.eq('status', 'active')`, suggesting it might exist or previous logic was wrong.
            // Checking the migration 20251230000006_user_departments.sql content (Step 22):
            // It has `id, user_id, department_id, is_primary, created_at`. NO STATUS COLUMN.
            // So previous code was likely broken there too. I will remove `.eq('status', 'active')`.

            if (userDepts) {
                setSelectedDepartments(userDepts.map((d: any) => d.department_id));
            }

            // Set primary role
            if (profileData?.primary_role) {
                setPrimaryRole(profileData.primary_role);
            } else if (activeRoles.length > 0) {
                setPrimaryRole(activeRoles[0]);
            }

            // Load role history
            // Replaces RoleService.getUserRolesTimeline
            const { data: historyData, error: historyError } = await supabase
                .from('user_roles')
                .select('*, roles (*)')
                .eq('clerk_user_id', uid)
                .order('assigned_at', { ascending: false });

            if (historyError) throw historyError;

            // Group by role_slug to match expected format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const timeline = (historyData || []).reduce((acc: Record<string, any[]>, roleAssignment: any) => {
                const slug = roleAssignment.role_slug;
                if (!acc[slug]) {
                    acc[slug] = [];
                }
                acc[slug].push({
                    assigned_at: roleAssignment.assigned_at,
                    effective_until: roleAssignment.effective_until,
                    revoked_at: roleAssignment.revoked_at,
                    is_active: roleAssignment.is_active,
                    assigned_by: roleAssignment.assigned_by,
                    assigned_reason: roleAssignment.assigned_reason
                });
                return acc;
            }, {});

            setRoleHistory(timeline);

        } catch (error) {
            console.error('Error loading user data:', error);
            toast({
                title: "Error fetching profile",
                description: "Could not load your profile data.",
                variant: "destructive"
            });
        }
    };

    const handleDepartmentToggle = (deptId: string) => {
        setSelectedDepartments(prev =>
            prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
        );
    };

    const handleRoleToggle = (roleSlug: string) => {
        setSelectedRoles(prev => {
            if (prev.includes(roleSlug)) {
                // If removing primary role, set new primary
                if (primaryRole === roleSlug && prev.length > 1) {
                    const otherRoles = prev.filter(r => r !== roleSlug);
                    setPrimaryRole(otherRoles[0]);
                }
                return prev.filter(r => r !== roleSlug);
            } else {
                return [...prev, roleSlug];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                await completeOnboarding(selectedRoles, primaryRole, selectedDepartments);
                toast({
                    title: "Success",
                    description: "Your roles have been updated.",
                });
                // Redirect to dashboard after successful save
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Onboarding error:', error);
                toast({
                    title: "Error",
                    description: "Failed to save changes. Please try again.",
                    variant: "destructive"
                });
            }
        });
    };

    const handleSkip = () => {
        startTransition(async () => {
            try {
                await skipOnboarding();
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Skip error:', error);
                toast({
                    title: "Error",
                    description: "Failed to skip.",
                    variant: "destructive"
                });
            }
        });
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading info...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl text-foreground">
            <h1 className="text-3xl font-bold mb-2">Role Management</h1>
            <p className="text-muted-foreground mb-8">
                Select the roles that apply to you. You can have multiple roles simultaneously.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column: Role selection */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role selection cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AVAILABLE_ROLES.map((role) => {
                                const isSelected = selectedRoles.includes(role.slug);
                                const isPrimary = primaryRole === role.slug;

                                return (
                                    <div
                                        key={role.slug}
                                        className={`
                      p-4 border rounded-lg cursor-pointer transition-all bg-card
                      ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}
                    `}
                                        onClick={() => handleRoleToggle(role.slug)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => { }}
                                                    className="h-4 w-4 text-primary rounded border-input"
                                                />
                                                <h3 className="font-semibold">{role.name}</h3>
                                            </div>
                                            {isPrimary && (
                                                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{role.description}</p>

                                        {isSelected && (
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPrimaryRole(role.slug);
                                                    }}
                                                    className="text-xs text-primary hover:underline font-medium"
                                                >
                                                    {isPrimary ? '✓ Is Primary' : 'Make Primary'}
                                                </button>

                                                {role.slug === 'super_admin' && (
                                                    <span className="text-[10px] text-destructive font-medium uppercase tracking-wider">
                                                        Restricted
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Primary role selector */}
                        {selectedRoles.length > 1 && (
                            <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                <label className="block text-sm font-medium mb-3">
                                    Select Primary Role
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRoles.map(roleSlug => {
                                        const role = AVAILABLE_ROLES.find(r => r.slug === roleSlug);
                                        return (
                                            <button
                                                key={roleSlug}
                                                type="button"
                                                onClick={() => setPrimaryRole(roleSlug)}
                                                className={`
                          px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                          ${primaryRole === roleSlug
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }
                        `}
                                            >
                                                {role?.name || roleSlug}
                                                {primaryRole === roleSlug && ' ✓'}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Your primary role determines your default dashboard view.
                                </p>
                            </div>
                        )}

                        {/* Department Selection - Only for Internal Roles */}
                        {selectedRoles.some(r => ['employee', 'manager', 'admin', 'super_admin'].includes(r)) && (
                            <div className="pt-6 border-t border-border">
                                <h2 className="text-xl font-semibold mb-4">Select Departments</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Choose the departments you belong to or are interested in.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {departments.map((dept) => {
                                        const isSelected = selectedDepartments.includes(dept.id);
                                        return (
                                            <div
                                                key={dept.id}
                                                onClick={() => handleDepartmentToggle(dept.id)}
                                                className={`
                                                    p-3 border rounded-md cursor-pointer transition-all text-sm
                                                    ${isSelected
                                                        ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                                        : 'bg-card border-border hover:border-primary/50'}
                                                `}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => { }}
                                                        className="h-4 w-4 text-primary rounded border-input"
                                                    />
                                                    <span className="font-medium">{dept.department_name}</span>
                                                </div>
                                                {dept.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {dept.description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-4 pt-6 border-t border-border">
                            <button
                                type="submit"
                                disabled={isPending || selectedRoles.length === 0}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex-1 font-medium"
                            >
                                {isPending ? 'Saving...' : 'Save Roles & Continue'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkip}
                                className="px-6 py-3 border border-input rounded-lg hover:bg-accent hover:text-accent-foreground font-medium"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right column: Role timeline/history */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
                            <h3 className="font-semibold mb-4">Your Role History</h3>

                            {roleHistory ? (
                                <RoleTimeline history={roleHistory} />
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    <p>No role history yet.</p>
                                    <p className="mt-1 opacity-70">Assignments will appear here.</p>
                                </div>
                            )}

                            <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                <h4 className="font-medium text-yellow-600 text-sm mb-1">
                                    💡 Tips
                                </h4>
                                <ul className="text-xs text-yellow-600/90 space-y-1 list-disc pl-3">
                                    <li>You can have multiple roles</li>
                                    <li>Each role grants specific permissions</li>
                                    <li>Primary role sets default view</li>
                                    <li>History is preserved for audit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

