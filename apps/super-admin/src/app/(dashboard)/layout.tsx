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
    if (!userId) redirect("/");

    // Verify role in Supabase
    const supabase = createAdminClient();
    const { data: user } = await supabase
        .from("partner_users")
        .select("role")
        .eq("clerk_user_id", userId)
        .single();

    if (!user || user.role !== "admin") {
        // TODO: Better unauthorized page
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You do not have permission to access the Super Admin dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar userRole={user.role as UserRole} />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
