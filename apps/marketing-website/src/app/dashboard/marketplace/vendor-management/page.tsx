import { VendorManagementWizard } from "@/components/dashboard/vendor-management/VendorManagementWizard";
import { getVendorProfile, saveVendorProfile, resetVendorProfile } from "@/actions/vendor-management";

export default async function VendorManagementPage() {
    // Fetch existing vendor data
    const initialData = await getVendorProfile();

    return (
        <VendorManagementWizard
            initialData={initialData || undefined}
            onSave={saveVendorProfile}
            onReset={resetVendorProfile}
        />
    );
}
