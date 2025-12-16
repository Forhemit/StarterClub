import { Button } from "@/components/ui/button";

export default function PartnersDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome to the Starter Club Partner Portal. Select an activity from the sidebar to get started.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholders for dashboard widgets */}
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                    <h3 className="font-semibold mb-2">Quick Stats</h3>
                    <p className="text-sm text-muted-foreground">Coming soon: intro counts, resource downloads.</p>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                    <h3 className="font-semibold mb-2">Latest Intros</h3>
                    <p className="text-sm text-muted-foreground">No new intros this week.</p>
                </div>
            </div>
        </div>
    );
}
