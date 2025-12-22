import { ChecklistContainer } from '@/components/checklist/ChecklistContainer';
import { getChecklistData } from '@/app/actions/checklist';

export default async function FoundationChecklistPage() {
    const data = await getChecklistData();

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <ChecklistContainer initialData={data} />
        </div>
    );
}
