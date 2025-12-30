import InterviewHistory from './InterviewHistory';
import { HRDashboardHeader } from '@/components/hr/Shared/HRDashboardHeader';

export default function TalentPage() {
    return (
        <div className="p-6">
            <HRDashboardHeader
                title="Talent Management"
                subtitle="Recruit, track, and hire top talent"
                userType="admin"
            />
            <InterviewHistory />
        </div>
    );
}
