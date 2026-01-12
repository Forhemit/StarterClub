import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export default async function DebugOrgPage() {
    const { sessionClaims } = await auth();
    const supabase = await createSupabaseServerClient();

    // 1. Check Metadata (Did the Auth Hook work?)
    // Note: Clerk sessionClaims might lag behind DB updates if not refreshed, 
    // but Supabase token should have it if it was signed recently.
    const appMetadata = sessionClaims?.publicMetadata || {}; // Clerk maps it here sometimes
    // Or check the Supabase token claims if we decoded it, but let's look at what Supabase "Sees"

    // 2. Fetch Core Companies (Should be filtered by RLS)
    const { data: companies, error: companiesError } = await supabase
        .from('core_companies')
        .select('*');

    // 3. Fetch Organizations (Should be filtered RLS)
    const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*');

    // 4. Client checking (User User)
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-3xl font-bold">Organization Architecture Debugger</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">🔐 Auth & Metadata</h2>
                    <pre className="bg-muted p-4 rounded overflow-auto text-xs">
                        {JSON.stringify({
                            userId: user?.id,
                            email: user?.email,
                            app_metadata: user?.app_metadata, // This is the crucial part from Supabase
                            clerk_claims: sessionClaims
                        }, null, 2)}
                    </pre>
                </div>

                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">🏢 Organizations (RLS Check)</h2>
                    {orgsError ? (
                        <div className="text-red-500">Error: {orgsError.message}</div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Found {orgs?.length || 0} organizations</p>
                            <div className="space-y-2">
                                {orgs?.map(org => (
                                    <div key={org.id} className="p-2 border rounded">
                                        <div className="font-bold">{org.name}</div>
                                        <div className="text-xs text-muted-foreground">{org.id}</div>
                                        <div className="text-xs bg-blue-100 text-blue-800 inline-block px-1 rounded">Owner: {org.owner_email}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border rounded-lg bg-card md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">🏭 Core Companies (The Prize)</h2>
                    {companiesError ? (
                        <div className="text-red-500">Error: {companiesError.message}</div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Query: <code className="bg-muted px-1">select * from core_companies</code> (No Filters)
                            </p>
                            {companies?.length === 0 && (
                                <div className="text-yellow-600 bg-yellow-50 p-4 rounded">
                                    No companies found. RLS might be too strict, or no companies link to your organization.
                                </div>
                            )}
                            {companies?.map(company => (
                                <div key={company.id} className="flex items-center justify-between p-4 border rounded bg-background">
                                    <div>
                                        <div className="text-lg font-bold">{company.canonical_name}</div>
                                        <div className="text-sm text-muted-foreground">Tax ID: {company.tax_id || 'N/A'}</div>
                                        <div className="text-xs text-muted-foreground mt-1">Source: {company.source_module} (Legacy ID: {company.legacy_id})</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground mb-1">Organization ID</div>
                                        <code className="text-xs bg-muted px-2 py-1 rounded">{company.organization_id}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
