import { createSupabaseServerClient } from "@/lib/supabase/server";
import CaseStudiesClient from "./CaseStudiesClient";

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
    const supabase = await createSupabaseServerClient();
    const { data: studies } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("updated_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Case Studies</h1>
                <p className="text-muted-foreground mt-2">See how other partners are winning with Starter Club members.</p>
            </div>

            <CaseStudiesClient studies={studies || []} />
        </div>
    );
}
