import { auth } from "@clerk/nextjs/server";
import OnboardingFlow from './OnboardingFlow';
import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';
import { isModuleInstalled } from "@/actions/marketplace";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
    const { userId } = await auth();
    // Default to a placeholder if not logged in
    if (!userId) return <div>Please log in</div>;

    const hasAccess = await isModuleInstalled("HR Onboarding System", true);

    if (!hasAccess) {
        return (
            <div className="p-6">
                <HRDashboardHeader
                    title="Employee Onboarding"
                    subtitle="Manage your new hire journey"
                    userType="employee"
                />
                <div className="max-w-4xl mx-auto mt-12 text-center p-12 border border-dashed rounded-lg bg-muted/10">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-primary/10">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Module Not Installed</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        The HR Onboarding System is a premium marketplace module.
                        Install it to streamline your employee onboarding workflows.
                    </p>
                    <Link href="/dashboard/marketplace">
                        <Button>Go to Marketplace</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // We fetch data inside the client component to avoid build-time static gen errors

    return (
        <div className="p-6">
            <HRDashboardHeader
                title="Employee Onboarding"
                subtitle="Manage your new hire journey"
                userType="employee"
            />
            <div className="max-w-4xl mx-auto">
                <OnboardingFlow newHireId={userId} />
            </div>
        </div>
    );
}
