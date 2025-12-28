'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJournalEntry, JournalEntryInput } from '@/actions/accounting';

type Account = { id: string; account_code: string; account_name: string };
type IncomeSource = { id: string; source_name: string };

export default function JournalEntryForm({
    accounts,
    incomeSources,
}: {
    accounts: Account[];
    incomeSources: IncomeSource[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        transaction_date: new Date().toISOString().split('T')[0],
        description: '',
        income_source_id: '',
        external_reference_id: '',
    });

    const [lines, setLines] = useState<
        { ledger_account_id: string; amount: string; entry_type: 'debit' | 'credit'; description: string }[]
    >([
        { ledger_account_id: '', amount: '', entry_type: 'debit', description: '' },
        { ledger_account_id: '', amount: '', entry_type: 'credit', description: '' },
    ]);

    const addLine = () => {
        setLines([...lines, { ledger_account_id: '', amount: '', entry_type: 'debit', description: '' }]);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: string, value: string) => {
        const newLines = [...lines];
        newLines[index] = { ...newLines[index], [field]: value };
        setLines(newLines);
    };

    const totalDebits = lines
        .filter((l) => l.entry_type === 'debit')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

    const totalCredits = lines
        .filter((l) => l.entry_type === 'credit')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

    const balanced = Math.abs(totalDebits - totalCredits) < 0.01;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!balanced) {
            setError(`Entries are not balanced. Debits: ${totalDebits}, Credits: ${totalCredits}`);
            setLoading(false);
            return;
        }

        const payload: JournalEntryInput = {
            ...formData,
            income_source_id: formData.income_source_id || undefined,
            external_reference_id: formData.external_reference_id || undefined,
            lines: lines.map((l) => ({
                ledger_account_id: l.ledger_account_id,
                amount: parseFloat(l.amount),
                entry_type: l.entry_type as 'debit' | 'credit',
                description: l.description,
            })),
        };

        const result = await createJournalEntry(payload);

        if (result.error) {
            setError(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
        } else {
            router.refresh();
            router.push('/admin/finance');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">New Journal Entry</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium dark:text-zinc-300">Date</label>
                        <input
                            type="date"
                            required
                            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border"
                            value={formData.transaction_date}
                            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-zinc-300">Source (Optional)</label>
                        <select
                            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border"
                            value={formData.income_source_id}
                            onChange={(e) => setFormData({ ...formData, income_source_id: e.target.value })}
                        >
                            <option value="">None / Manual</option>
                            {incomeSources.map((s) => (
                                <option key={s.id} value={s.id}>{s.source_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium dark:text-zinc-300">Description</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium dark:text-zinc-300">External Ref (Optional)</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border"
                            value={formData.external_reference_id}
                            onChange={(e) => setFormData({ ...formData, external_reference_id: e.target.value })}
                            placeholder="Check #, Transaction ID, etc."
                        />
                    </div>
                </div>

                {/* Lines */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Lines</h3>
                    <div className="space-y-2">
                        {lines.map((line, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                                <select
                                    required
                                    className="flex-1 rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border text-sm"
                                    value={line.ledger_account_id}
                                    onChange={(e) => updateLine(index, 'ledger_account_id', e.target.value)}
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>{a.account_code} - {a.account_name}</option>
                                    ))}
                                </select>
                                <select
                                    required
                                    className="w-24 rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border text-sm"
                                    value={line.entry_type}
                                    onChange={(e) => updateLine(index, 'entry_type', e.target.value)}
                                >
                                    <option value="debit">Debit</option>
                                    <option value="credit">Credit</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className="w-32 rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border text-sm"
                                    value={line.amount}
                                    onChange={(e) => updateLine(index, 'amount', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Line Description"
                                    className="flex-1 rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-zinc-800 p-2 border text-sm"
                                    value={line.description}
                                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLine(index)}
                                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addLine}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        + Add Line
                    </button>
                </div>

                {/* Totals */}
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
                    <div className="text-sm">
                        <span className="font-semibold">Total Debits:</span> {totalDebits.toFixed(2)}
                    </div>
                    <div className={`text-sm ${balanced ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                        {balanced ? 'Balanced' : 'Unbalanced'}
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold">Total Credits:</span> {totalCredits.toFixed(2)}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !balanced}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Journal Entry'}
                    </button>
                </div>
            </form>
        </div>
    );
}
