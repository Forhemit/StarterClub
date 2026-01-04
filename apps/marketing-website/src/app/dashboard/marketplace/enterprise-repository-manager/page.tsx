
import { Metadata } from "next";
import { getEnterpriseRepository, updateEnterpriseRepository, resetEnterpriseRepository } from "@/actions/enterprise-repository";
import { EnterpriseRepositoryWizard } from "@/components/dashboard/enterprise/EnterpriseRepositoryWizard";

export const metadata: Metadata = {
    title: "Enterprise Repository Manager | Starter Club",
    description: "Manage access permissions for your acquisition documents.",
};

export default async function EnterpriseRepositoryPage() {
    // Fetch initial data
    const initialData = await getEnterpriseRepository();

    return (
        <div className="w-full h-full bg-background">
            <EnterpriseRepositoryWizard
                initialData={initialData}
                onSave={updateEnterpriseRepository}
                onReset={resetEnterpriseRepository}
            />
        </div>
    );
}
