import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    // Fetch logs
    const supabase = createAdminClient();
    const { data: logs, error } = await supabase.from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Audit Logs</h1>
                <p className="text-muted-foreground mt-2">View system activity and security events.</p>
            </div>

            <AuditLogsClient initialLogs={logs || []} />
        </div>
    );
}
