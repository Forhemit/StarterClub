"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, AlertTriangle, User, Building2, Users, Handshake, UserCheck, Megaphone, LogIn, Loader2 } from "lucide-react";

// Test user configurations
const TEST_USERS = [
    {
        type: "Company Admin",
        email: "company_admin@test.com",
        password: "TestPass123!",
        role: "Company Administrator with full permissions",
        portal: "/member-dashboard",
        icon: Building2,
        color: "from-blue-500 to-blue-600",
    },
    {
        type: "Company Member 1",
        email: "company_member1@test.com",
        password: "TestPass123!",
        role: "Standard company user (reports to Admin)",
        portal: "/member-dashboard",
        icon: User,
        color: "from-cyan-500 to-cyan-600",
    },
    {
        type: "Company Member 2",
        email: "company_member2@test.com",
        password: "TestPass123!",
        role: "Standard company user",
        portal: "/member-dashboard",
        icon: Users,
        color: "from-teal-500 to-teal-600",
    },
    {
        type: "Partner Admin",
        email: "partner_admin@test.com",
        password: "TestPass123!",
        role: "Partner organization administrator",
        portal: "/member-dashboard",
        icon: Handshake,
        color: "from-purple-500 to-purple-600",
    },
    {
        type: "Partner Member",
        email: "partner_member@test.com",
        password: "TestPass123!",
        role: "Standard partner user (reports to Partner Admin)",
        portal: "/member-dashboard",
        icon: UserCheck,
        color: "from-pink-500 to-pink-600",
    },
    {
        type: "Sponsor Admin",
        email: "sponsor_admin@test.com",
        password: "TestPass123!",
        role: "Sponsor-only administrator",
        portal: "/member-dashboard",
        icon: Megaphone,
        color: "from-amber-500 to-amber-600",
    },
];

function TestUserCard({
    user,
    onLogin,
    isLoading,
    error,
}: {
    user: (typeof TEST_USERS)[0];
    onLogin: () => void;
    isLoading: boolean;
    error?: string;
}) {
    const Icon = user.icon;

    return (
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${user.color}`} />

            <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${user.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{user.type}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{user.role}</p>
                </div>
            </div>

            {error && (
                <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-950 px-2 py-1 rounded">{error}</p>
            )}

            <button
                onClick={onLogin}
                disabled={isLoading}
                className={`mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${user.color} py-2.5 px-4 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>
                        <LogIn className="h-4 w-4" />
                        Login as {user.type}
                    </>
                )}
            </button>
        </div>
    );
}

export default function TestUsersPage() {
    const [loadingUser, setLoadingUser] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Create Supabase client lazily to avoid SSR issues
    const supabase = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
            console.error("Missing Supabase env vars:", { url: !!url, key: !!key });
            return null;
        }
        return createClient(url, key);
    }, []);

    const handleLogin = async (user: (typeof TEST_USERS)[0]) => {
        if (!supabase) return;

        setLoadingUser(user.email);
        setErrors((prev) => ({ ...prev, [user.email]: "" }));

        try {
            // Sign out any existing session first
            await supabase.auth.signOut();

            // Sign in with email and password
            const { data, error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: user.password,
            });

            if (error) {
                console.error("Login error:", error);
                setErrors((prev) => ({
                    ...prev,
                    [user.email]: error.message || "Login failed. User may not exist in Supabase.",
                }));
                setLoadingUser(null);
                return;
            }

            if (data.session) {
                // Successfully logged in - redirect to portal
                window.location.href = user.portal;
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrors((prev) => ({
                ...prev,
                [user.email]: "Unexpected error occurred. Check console.",
            }));
            setLoadingUser(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Warning Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-semibold tracking-wide">
                            ⚠️ TEST ENVIRONMENT ONLY — DO NOT USE IN PRODUCTION ⚠️
                        </p>
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center mb-6">
                        <img
                            src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                            alt="Starter Club Logo"
                            className="h-full w-full object-contain rounded-md"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Test Users Portal</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Click any button below to instantly log in as that test user
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-lg text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Users must be created in Supabase Dashboard first</span>
                    </div>
                </div>

                {/* User Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {TEST_USERS.map((user) => (
                        <TestUserCard
                            key={user.email}
                            user={user}
                            onLogin={() => handleLogin(user)}
                            isLoading={loadingUser === user.email}
                            error={errors[user.email]}
                        />
                    ))}
                </div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
