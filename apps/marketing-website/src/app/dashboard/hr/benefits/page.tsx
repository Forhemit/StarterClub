import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';

export default function BenefitsPage() {
    return (
        <div className="p-6">
            <HRDashboardHeader
                title="Benefits Hub"
                subtitle="Health, wellness, and insurance administration"
                userType="admin"
            />
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/50">
                <h3 className="text-xl font-medium text-muted-foreground">Benefits Module Coming Soon</h3>
            </div>
        </div>
    );
}
