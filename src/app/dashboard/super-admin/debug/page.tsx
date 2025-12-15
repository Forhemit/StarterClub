import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDebugPage() {
    console.log("Debug Page: Starting...");

    let result = null;
    let error = null;

    try {
        const sb = createAdminClient();
        console.log("Debug Page: Client created.");
        const { count, error: err } = await sb.from("partner_users").select("*", { count: 'exact', head: true });
        if (err) throw err;
        result = count;
        console.log("Debug Page: Fetch Success", count);
    } catch (e: any) {
        console.error("Debug Page Error:", e);
        error = e.message;
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Admin Connection Debug</h1>
            <pre className="mt-4 bg-gray-100 p-4 rounded">
                {JSON.stringify({ result, error }, null, 2)}
            </pre>
        </div>
    );
}
