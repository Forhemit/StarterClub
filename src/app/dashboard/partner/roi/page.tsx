import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import RoiCalculator from "@/components/partners/RoiCalculator";

export const dynamic = "force-dynamic";

export default async function RoiPage() {
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    // Fetch org_id for the current user to allow saving
    let orgId = null;
    if (userId) {
        const { data } = await supabase
            .from("partner_users")
            .select("org_id")
            .eq("clerk_user_id", userId)
            .single();
        orgId = data?.org_id;
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">ROI Lab</h1>
                <p className="text-muted-foreground mt-2">
                    Calculate the estimated value of your partnership adjustments.
                    Adjust inputs to see how improving conversion or retention impacts your bottom line.
                </p>
            </div>

            <RoiCalculator orgId={orgId} />
        </div>
    );
}
