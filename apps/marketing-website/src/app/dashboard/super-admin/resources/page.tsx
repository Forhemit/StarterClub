import { ResourcesClient } from "./ResourcesClient";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ResourcesPage() {
    const supabase = createAdminClient();

    // Fetch initial data
    const { data: documents, error } = await supabase
        .from("resource_assets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-destructive">Error loading documents: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">Manage policies, guides, and assets for partners.</p>
                </div>
                {/* Search/Actions handled in Client */}
            </div>

            <ResourcesClient initialDocuments={documents || []} />
        </div>
    );
}
