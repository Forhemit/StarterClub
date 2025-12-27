"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { MemberDashboardView } from "@/components/dashboard/MemberDashboardView";

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

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <MemberDashboardView
            userEmail={userEmail}
            userRole={userRole}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
        />
    );
}
