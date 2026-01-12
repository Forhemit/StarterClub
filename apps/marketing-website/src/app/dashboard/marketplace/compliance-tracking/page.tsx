import { ComplianceTrackingWizard } from "@/components/dashboard/compliance/ComplianceTrackingWizard";
import { getComplianceProfile, saveComplianceProfile, resetComplianceProfile } from "@/actions/compliance";
import { ComplianceData } from "@/components/dashboard/compliance/types";

export default async function ComplianceTrackingPage() {
    // Fetch initial data
    const initialData = await getComplianceProfile();

    // Wrapper to match expected onSave signature
    const handleSave = async (data: ComplianceData): Promise<void> => {
        "use server";
        await saveComplianceProfile(data as any);
    };

    return (
        <ComplianceTrackingWizard
            initialData={initialData}
            onSave={handleSave}
            onReset={resetComplianceProfile}
        />
    );
}

