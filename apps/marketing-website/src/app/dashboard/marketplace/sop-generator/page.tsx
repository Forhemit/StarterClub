import { SOPGeneratorWizard } from "@/components/dashboard/sop-generator/SOPGeneratorWizard";
import { getPositionSOP, savePositionSOP, resetPositionSOP } from "@/actions/sop-generator";

export default async function SOPGeneratorPage() {
    // Fetch existing SOP data
    const sopData = await getPositionSOP();

    return (
        <SOPGeneratorWizard
            initialData={sopData ?? undefined}
            onSave={savePositionSOP}
            onReset={resetPositionSOP}
        />
    );
}
