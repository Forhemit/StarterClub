import { VaultBuilder } from "@/components/dashboard/admin/VaultBuilder";

export default function VaultBuilderPage() {
    return (
        <div className="flex flex-col h-full gap-4 p-4 md:p-8 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-bebas">Vault Builder</h2>
                    <p className="text-muted-foreground">
                        Architect and configure system modules using the JSON schema definition.
                    </p>
                </div>
            </div>

            <div className="flex-1">
                <VaultBuilder />
            </div>
        </div>
    );
}
