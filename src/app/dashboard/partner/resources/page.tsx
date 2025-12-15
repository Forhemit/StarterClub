import { createSupabaseServerClient } from "@/lib/supabase/server";
import ResourcesClient from "./ResourcesClient";

export const dynamic = "force-static"; // Changed to force-static since resources are likely not changing every request
export const revalidate = 3600; // Revalidate every hour


export default async function ResourcesPage() {
    const supabase = await createSupabaseServerClient();

    const { data: resources } = await supabase
        .from("resource_assets")
        .select("*")
        .order("title");

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Partner Resources</h1>
                        <p className="text-muted-foreground mt-1">Download guidebooks, one-pagers, and workshop kits to activate your partnership.</p>
                    </div>
                    {/* Admin "Add" button could go here if user has role */}
                </div>
            </div>

            <ResourcesClient initialResources={resources || []} />
        </div>
    );
}
