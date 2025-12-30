import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';
import { HRMetricsOverview } from '@/components/hr/analytics/HRMetricsOverview';

export default function AnalyticsPage() {
    return (
        <div className="p-6">
            <HRDashboardHeader
                title="HR Analytics"
                subtitle="Data-driven insights for workforce planning"
                userType="admin"
            />
            <div className="space-y-6">
                <HRMetricsOverview />
                <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/50">
                    <h3 className="text-xl font-medium text-muted-foreground">Advanced Reports Coming Soon</h3>
                </div>
            </div>
        </div>
    );
}
