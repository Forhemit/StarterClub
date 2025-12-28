import { getChartOfAccounts, getIncomeSources } from '@/actions/accounting';
import JournalEntryForm from '@/components/finance/journal-entry-form';

export default async function NewJournalEntryPage() {
    const accounts = await getChartOfAccounts();
    const incomeSources = await getIncomeSources();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Finance: New Journal Entry</h1>
            <JournalEntryForm accounts={accounts} incomeSources={incomeSources} />
        </div>
    );
}
