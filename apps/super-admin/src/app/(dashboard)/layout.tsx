import { Sidebar } from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/privileged/supabase-admin";
import { UserRole } from "@/lib/modules";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    const isDev = process.env.NODE_ENV === "development";

    if (!userId && !isDev) redirect("/");

    let userRole = "admin"; // Default fallback (or for dev bypass)

    if (userId) {
        // Verify role in Supabase
        const supabase = createAdminClient();
        const { data: userData } = await supabase
            .from("partner_users")
            .select("role")
            .eq("clerk_user_id", userId)
            .single();

        const user = userData as any;

        if ((!user || user.role !== "admin") && !isDev) {
            // TODO: Better unauthorized page
            return (
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border">
                        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
                        <p className="text-muted-foreground">You do not have permission to access the Super Admin dashboard.</p>
                    </div>
                </div>
            );
        }
        if (user) userRole = user.role;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar userRole={userRole as UserRole} />
            <main className="flex-1 p-8">
                {children}
            </main>
            {isDev && !userId && (
                <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-bold shadow-lg border border-yellow-200 z-50">
                    DEV MODE: AUTH BYPASSED
                </div>
            )}
        </div>
    );
}
