import OnboardingFlow from './OnboardingFlow';
import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';

export default function OnboardingPage() {
    return (
        <div className="p-6">
            <HRDashboardHeader
                title="Employee Onboarding"
                subtitle="Manage new hires and their journey"
                userType="admin"
            />
            <div className="max-w-4xl mx-auto">
                <OnboardingFlow newHireId="new-hire-123" />
            </div>
        </div>
    );
}
