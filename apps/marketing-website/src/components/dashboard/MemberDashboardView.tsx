"use client";

import { UserCircle, LogOut, Loader2, Building2, User, Users, Handshake, UserCheck, Megaphone, ArrowLeft } from "lucide-react";
import Link from "next/link";



// Actually, let's redefine or move ROLE_CONFIG here to avoid circular dep if we import from page.
// Better to move everything shared to here.

// Role configurations with distinct colors and icons
export const ROLE_CONFIG_SHARED: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string; size?: number }> }> = {
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

interface MemberDashboardViewProps {
    userEmail: string | null;
    userRole: string | null;
    isSimulated?: boolean;
    onLogout?: () => void;
    isLoggingOut?: boolean;
}

export const MemberDashboardView = ({ userEmail, userRole, isSimulated = false, onLogout, isLoggingOut = false }: MemberDashboardViewProps) => {
    const roleConfig = userRole ? ROLE_CONFIG_SHARED[userRole] : null;
    const RoleIcon = roleConfig?.icon || UserCircle;

    return (
        <div className={`flex flex-col items-center justify-center p-4 ${isSimulated ? '' : 'min-h-screen bg-slate-50'}`}>
            <div className={`w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg ${isSimulated ? 'border-dashed' : ''}`}>
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
                        {isSimulated ? 'Simulating user:' : 'Logged in as:'} <span className="font-mono text-slate-700">{userEmail}</span>
                    </p>
                )}

                <p className="mb-8 text-slate-500">
                    Welcome! You are {isSimulated ? 'viewing the' : 'logged in as a'} <strong>{roleConfig?.label || 'Member'}</strong> dashboard.
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

                {!isSimulated && (
                    <div className="flex flex-col gap-3">
                        <button
                            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            onClick={onLogout}
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
                )}
            </div>
        </div>
    );
};
