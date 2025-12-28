import Link from 'next/link';
import { getJournalEntries } from '@/actions/accounting';

export default async function FinanceDashboardPage() {
    const entries = await getJournalEntries();

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Finance Dashboard</h1>
                <div className="space-x-4">
                    <Link
                        href="/admin/finance/journal/new"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        New Journal Entry
                    </Link>
                    <a
                        href="/api/admin/finance/export"
                        download
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white dark:bg-zinc-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                        Export CSV
                    </a>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Latest journal entries across all sources.</p>
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-700">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {entries?.map((entry: any) => (
                            <li key={entry.journal_entry_id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{entry.entry_description}</p>
                                        <p className="text-xs text-gray-500">{entry.source_name} {entry.external_reference_id ? `(#${entry.external_reference_id})` : ''}</p>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {entry.account_name} ({entry.account_code})
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                                            {entry.entry_type === 'debit' ? '+' : '-'}${Number(entry.amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 sm:flex sm:justify-between">
                                    <p>{new Date(entry.transaction_date).toLocaleDateString()}</p>
                                    <p>{entry.line_description}</p>
                                </div>
                            </li>
                        ))}
                        {(!entries || entries.length === 0) && (
                            <li className="px-4 py-8 text-center text-gray-500">No transactions found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
