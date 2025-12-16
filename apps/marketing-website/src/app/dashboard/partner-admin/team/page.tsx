import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import TeamClient from "./TeamClient";
import { redirect } from "next/navigation";

export default async function ManageTeamPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Fetch current user's org
    // Note: We need admin-level access to read partner_users table fully?
    // Or just RLS allows reading own org? Assuming RLS setup or using Admin client for now
    // to be safe since we are in "Partner Admin" role.
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // 1. Get my Org ID
    const { data: me } = await supabase.from("partner_users").select("org_id").eq("clerk_user_id", userId).single();
    if (!me?.org_id) {
        return <div className="p-6">You do not belong to an organization.</div>;
    }

    // 2. Fetch team members
    const { data: users } = await supabase.from("partner_users").select("*").eq("org_id", me.org_id);

    // We ideally want email too. But emails are in Clerk.
    // Syncing email to DB is best practice, but for now we might just show IDs or 
    // fetch from Clerk if list is small. 
    // For MVP "Guest Email" requirement, we return what we have.
    // The Invite Action returns credentials so the admin sees them immediately.

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manage Team</h1>
                <p className="text-muted-foreground">Invite and manage team members for your organization.</p>
            </div>
            <TeamClient initialUsers={users || []} />
        </div>
    );
}
