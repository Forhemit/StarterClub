
import { AcquisitionReadinessWizard } from "@/components/dashboard/acquisition/AcquisitionReadinessWizard";
import { getAcquisitionReadinessData, saveAcquisitionReadinessData, resetAcquisitionReadinessData } from "@/actions/acquisition-readiness";

export default async function AcquisitionReadinessPage() {
    const initialData = await getAcquisitionReadinessData();

    return (
        <AcquisitionReadinessWizard
            initialData={initialData}
            onSave={saveAcquisitionReadinessData}
            onReset={resetAcquisitionReadinessData}
        />
    );
}
