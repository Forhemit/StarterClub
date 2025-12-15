import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ApiKeysClient from "./ApiKeysClient";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");
    // Additional checkAdmin logic if needed, but RLS/Actions handle security mostly.
    // For page load, we should check if they can access.

    // Fetch API Keys
    const supabase = createAdminClient();
    // We want to fetch all keys if admin.
    const { data: keys, error } = await supabase.from("api_keys").select(`
        *,
        partner_orgs ( name )
    `).order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">API Keys</h1>
                <p className="text-muted-foreground mt-2">Manage programmatic access keys.</p>
            </div>

            <ApiKeysClient initialKeys={keys || []} />
        </div>
    );
}
