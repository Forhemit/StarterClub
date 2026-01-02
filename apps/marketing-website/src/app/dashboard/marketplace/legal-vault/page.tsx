import { LegalVaultWizard } from "@/components/dashboard/legal/LegalVaultWizard";
import { getLegalEntity, saveLegalVaultProfile, resetLegalEntity } from "@/actions/legal-vault";
import { getEntityAddresses } from "@/actions/addresses";
import { getContactsForEntity } from "@/actions/contacts";
import { getEntityDocuments } from "@/actions/documents";
import { getLegalContactsForEntity } from "@/actions/legal-contacts";
import { LegalVaultData } from "@/components/dashboard/legal/types";

export default async function LegalVaultPage() {
    // 1. Fetch main entity
    const entity = await getLegalEntity();

    // 2. If entity exists, fetch related data
    let initialData: LegalVaultData | undefined;

    if (entity && entity.id) {
        // Fetch all relations in parallel
        const [addresses, contacts, documents, attorneys] = await Promise.all([
            getEntityAddresses(entity.id),
            getContactsForEntity(entity.id),
            getEntityDocuments(entity.id),
            getLegalContactsForEntity(entity.id)
        ]);

        initialData = {
            ...entity,
            addresses: (addresses || []).map(a => ({
                id: a.id,
                label: a.address_type,
                street1: a.line1,
                street2: a.line2 || undefined,
                city: a.city,
                state: a.state,
                zip_code: a.zip,
                country: a.country || "US",
                is_primary: a.is_primary
            })),
            contacts: (contacts || []).map(c => ({
                id: c.id,
                contact_type: c.contact_type,
                phone: c.phone || undefined,
                email: c.email || undefined,
                is_primary: c.is_primary || false
            })),
            documents: documents || [],
            attorneys: (attorneys || []).filter(a => a.role === 'attorney').map(a => ({
                id: a.id,
                name: a.name,
                role: 'attorney',
                attorney_type: a.attorney_type || undefined,
                email: a.email || undefined,
                phone: a.phone || undefined,
                website: a.website || undefined,
                address_line1: a.address_line1 || undefined,
                city: a.city || undefined,
                state: a.state || undefined,
                zip: a.zip || undefined
            })),
        } as LegalVaultData;
    }

    return (
        <LegalVaultWizard
            initialData={initialData}
            onSave={saveLegalVaultProfile}
            onReset={resetLegalEntity}
        />
    );
}
