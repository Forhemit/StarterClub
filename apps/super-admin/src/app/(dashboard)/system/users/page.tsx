import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UsersClient, { PartnerUser, PartnerOrg } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    let users: PartnerUser[] = [];
    let orgs: PartnerOrg[] = [];
    let error = null;

    try {
        console.log("Admin Page: Fetching data...");
        // Re-import safe factory
        const adminAuthClient = createAdminClient();

        // Explicitly check fetching
        const usersReq = await adminAuthClient.from("partner_users").select("*").order("created_at", { ascending: false });
        if (usersReq.error) throw new Error(`Users fetch error: ${usersReq.error.message}`);

        const orgsReq = await adminAuthClient.from("partner_orgs").select("*").order("name");
        if (orgsReq.error) throw new Error(`Orgs fetch error: ${orgsReq.error.message}`);

        users = (usersReq.data || []) as PartnerUser[];
        orgs = (orgsReq.data || []) as PartnerOrg[];
        console.log("Admin Page: Data fetched successfully.");
    } catch (e: any) {
        console.error("Admin Page Load Error:", e);
        error = e.message || "Unknown error";
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-red-600">Configuration Error</h1>
                </div>
                <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-red-800">
                    <h3 className="font-bold mb-2">Failed to load Admin Data</h3>
                    <p>{error}</p>
                    <p className="mt-4 text-sm text-red-600">
                        Please ensure <code>SUPABASE_SERVICE_ROLE_KEY</code> is added to your <code>.env.local</code> file.
                        This is required for the Admin Dashboard to manage users securely.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-sans text-gray-900">User & Org Management</h1>
                <p className="text-muted-foreground mt-2">Create organizations and link Clerk users to them.</p>
            </div>

            <UsersClient initialUsers={users} initialOrgs={orgs} />
        </div>
    );
}
