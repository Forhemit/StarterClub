import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/privileged/supabase-admin";
import { Card } from "@/components/ui/card";
import { Users, Rocket, Building, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const supabase = createAdminClient();

    // Fetch Stats
    const { count: usersCount } = await supabase.from("partner_users").select("*", { count: 'exact', head: true });
    const { count: orgsCount } = await supabase.from("partner_orgs").select("*", { count: 'exact', head: true });

    // Using missions table from flight deck if possible, otherwise mock or use simple count
    // For now, let's just count users as "Pilots"

    const stats = [
        { label: "Total Users", value: usersCount || 0, icon: Users, color: "text-blue-500" },
        { label: "Partner Orgs", value: orgsCount || 0, icon: Building, color: "text-purple-500" },
        { label: "System Status", value: "Operational", icon: ShieldCheck, color: "text-green-500" },
        { label: "Active Missions", value: "12", icon: Rocket, color: "text-orange-500" } // Mocked for now
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, Commander. Here is your system overview.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500 italic">No recent usage logs found.</div>
                    </div>
                </Card>
                <Card className="col-span-3 p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                            → <span className="font-medium">Invite User</span> from User Management
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                            → <span className="font-medium">Review Reports</span> in Marketing
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
