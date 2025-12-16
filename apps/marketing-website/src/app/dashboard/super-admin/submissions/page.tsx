import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SubmissionsClient from "./SubmissionsClient";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    let waitlist = [];
    let inquiries = [];
    let error = null;

    try {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const adminAuthClient = createAdminClient();

        // Fetch Waitlist
        const waitlistReq = await adminAuthClient
            .from("waitlist_submissions")
            .select("*")
            .order("created_at", { ascending: false });

        if (waitlistReq.error) throw new Error(`Waitlist fetch error: ${waitlistReq.error.message}`);

        // Fetch Inquiries
        const inquiryReq = await adminAuthClient
            .from("partner_inquiries")
            .select("*")
            .order("created_at", { ascending: false });

        if (inquiryReq.error) throw new Error(`Inquiry fetch error: ${inquiryReq.error.message}`);

        waitlist = waitlistReq.data || [];
        inquiries = inquiryReq.data || [];

    } catch (e: any) {
        console.error("Submissions Page Error:", e);
        error = e.message;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-red-600">Error Loading Submissions</h1>
                </div>
                <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-red-800">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Submissions Viewer</h1>
                <p className="text-muted-foreground mt-2">Manage inbound interest from the public site.</p>
            </div>

            <SubmissionsClient waitlist={waitlist} inquiries={inquiries} />
        </div>
    );
}
