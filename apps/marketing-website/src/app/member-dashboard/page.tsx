"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { UserCircle, LogOut, Loader2, Building2, User, Users, Handshake, UserCheck, Megaphone, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Role configurations with distinct colors and icons
const ROLE_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string; size?: number }> }> = {
    company_admin: {
        label: "Company Admin",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: Building2,
    },
    company_member: {
        label: "Company Member",
        color: "text-cyan-600",
        bgColor: "bg-cyan-100",
        icon: User,
    },
    partner_admin: {
        label: "Partner Admin",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        icon: Handshake,
    },
    partner_member: {
        label: "Partner Member",
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        icon: UserCheck,
    },
    sponsor_admin: {
        label: "Sponsor Admin",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        icon: Megaphone,
    },
};

export default function MemberDashboardPage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Create Supabase client lazily to avoid SSR issues
    const supabase = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return null;
        return createClient(url, key);
    }, []);

    useEffect(() => {
        async function getUser() {
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || null);
                setUserRole(user.user_metadata?.role || null);
            }
            setLoading(false);
        }
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        if (!supabase) return;
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            window.location.href = "/test-users";
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    const roleConfig = userRole ? ROLE_CONFIG[userRole] : null;
    const RoleIcon = roleConfig?.icon || UserCircle;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                {/* Role-specific colored header */}
                <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${roleConfig?.bgColor || 'bg-slate-100'} ${roleConfig?.color || 'text-slate-600'}`}>
                    <RoleIcon size={48} />
                </div>

                {/* User Role Badge */}
                {roleConfig && (
                    <div className={`inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-semibold ${roleConfig.bgColor} ${roleConfig.color}`}>
                        {roleConfig.label}
                    </div>
                )}

                <h1 className="mb-2 text-2xl font-bold text-slate-900">
                    {roleConfig?.label || 'Member'} Dashboard
                </h1>

                {userEmail && (
                    <p className="mb-4 text-sm text-slate-500">
                        Logged in as: <span className="font-mono text-slate-700">{userEmail}</span>
                    </p>
                )}

                <p className="mb-8 text-slate-500">
                    Welcome! You are logged in as a <strong>{roleConfig?.label || 'Member'}</strong>.
                </p>

                {/* Role-specific info card */}
                <div className={`rounded-lg p-4 text-sm mb-6 ${roleConfig?.bgColor || 'bg-slate-50'} ${roleConfig?.color || 'text-slate-600'}`}>
                    <p className="font-semibold">Access Level:</p>
                    {userRole === 'company_admin' && <p>Full administrative access to company settings, users, and reports.</p>}
                    {userRole === 'company_member' && <p>Standard member access to view and submit reports.</p>}
                    {userRole === 'partner_admin' && <p>Partner organization administrator with client management access.</p>}
                    {userRole === 'partner_member' && <p>Partner team member with limited client access.</p>}
                    {userRole === 'sponsor_admin' && <p>Sponsor administrator with sponsorship management access.</p>}
                    {!userRole && <p>Role not configured. Contact administrator.</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut className="h-4 w-4" />
                                Logout & Return to Test Users
                            </>
                        )}
                    </button>

                    <Link
                        href="/test-users"
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Test Users (Keep Session)
                    </Link>
                </div>
            </div>
        </div>
    );
}
