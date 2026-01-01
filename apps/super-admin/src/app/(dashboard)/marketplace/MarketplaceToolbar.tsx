'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Assuming use-debounce is available, or use a custom hook/timeout
import { useEffect, useState } from 'react';

// Fallback debounce if use-debounce is not installed
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function MarketplaceToolbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search')?.toString() || '');
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Sync search to URL
    useEffect(() => {
        const currentSearch = searchParams.get('search')?.toString() || '';
        // Avoid infinite loop: only update if value changed
        if (currentSearch === debouncedSearch) return;

        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }, [debouncedSearch, pathname, replace, searchParams]); // Watch debouncedSearch

    // Handle Type Change
    const handleTypeChange = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term && term !== 'all') {
            params.set('type', term);
        } else {
            params.delete('type');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search modules..."
                    className="pl-8 bg-background"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    defaultValue={searchParams.get('search')?.toString()}
                />
            </div>
            <div className="flex items-center gap-2">
                <select
                    className="h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px]"
                    onChange={(e) => handleTypeChange(e.target.value)}
                    defaultValue={searchParams.get('type')?.toString() || 'all'}
                >
                    <option value="all">All Types</option>
                    <option value="industry">Industry</option>
                    <option value="submodule">Submodule</option>
                    <option value="core">Core / Resilience</option>
                    <option value="function">Function</option>
                </select>
            </div>
        </div>
    );
}
