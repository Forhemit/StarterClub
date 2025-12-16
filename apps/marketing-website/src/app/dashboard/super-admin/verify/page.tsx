import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VerifyClient from "./VerifyClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function VerifyPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    // Server-side check
    const supabase = await createSupabaseServerClient();
    const { data: serverJwt, error } = await supabase.rpc("current_jwt");

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Partner Portal Verification</h1>
            <p className="mb-8 text-gray-600">
                This page tests the Clerk + Supabase integration.
            </p>

            <div className="mb-8 p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">Server-Side Check (SSR)</h2>
                <pre className="text-xs bg-white p-2 border rounded overflow-auto">
                    {error ? `Error: ${error.message}` : `JWT Claims: ${JSON.stringify(serverJwt, null, 2)}`}
                </pre>
            </div>

            <div className="mb-8 p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">Client-Side Check (Browser)</h2>
                <VerifyClient />
            </div>
        </div>
    );
}
