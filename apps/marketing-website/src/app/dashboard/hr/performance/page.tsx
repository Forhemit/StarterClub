import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';

export default function PerformancePage() {
    return (
        <div className="p-6">
            <HRDashboardHeader
                title="Performance Reviews"
                subtitle="Track goals, OKRs, and 360 feedback"
                userType="admin"
            />
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/50">
                <h3 className="text-xl font-medium text-muted-foreground">Performance Module Coming Soon</h3>
            </div>
        </div>
    );
}
