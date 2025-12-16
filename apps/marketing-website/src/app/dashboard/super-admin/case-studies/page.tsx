import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CaseStudiesAdminClient from "./CaseStudiesAdminClient";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    let studies = [];
    let error = null;

    try {
        const adminAuthClient = createAdminClient();
        const { data, error: err } = await adminAuthClient.from("case_studies").select("*").order("created_at", { ascending: false });
        if (err) throw err;
        studies = data || [];
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Manage Case Studies</h1>
                <p className="text-muted-foreground mt-2">Publish success stories.</p>
            </div>
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
                    Error loading studies: {error}
                </div>
            )}
            <CaseStudiesAdminClient initialStudies={studies} />
        </div>
    );
}
