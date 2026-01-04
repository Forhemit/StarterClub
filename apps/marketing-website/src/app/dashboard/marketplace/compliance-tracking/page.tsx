import { ComplianceTrackingWizard } from "@/components/dashboard/compliance/ComplianceTrackingWizard";
import { getComplianceProfile, saveComplianceProfile, resetComplianceProfile } from "@/actions/compliance";

export default async function ComplianceTrackingPage() {
    // Fetch initial data
    const initialData = await getComplianceProfile();

    return (
        <ComplianceTrackingWizard
            initialData={initialData}
            onSave={saveComplianceProfile}
            onReset={resetComplianceProfile}
        />
    );
}
