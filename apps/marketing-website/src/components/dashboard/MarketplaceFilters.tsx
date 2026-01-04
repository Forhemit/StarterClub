'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';

interface MarketplaceFiltersProps {
    categories: string[];
}

export function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'az';
    const currentSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== currentSearch) {
            updateParams('search', debouncedSearch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (!value || value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (category: string) => {
        updateParams('category', category);
    };

    const handleSortChange = (sort: string) => {
        updateParams('sort', sort);
    };

    return (
        <div className="flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Top Bar: Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search modules..."
                        className="pl-9 bg-card"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 min-w-[180px]">
                        <Select value={currentSort} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full bg-card">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Sort by" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="az">Name (A-Z)</SelectItem>
                                <SelectItem value="latest">Newest First</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Categories */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCategoryChange('all')}
                        className={cn(
                            "rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                            currentCategory === 'all'
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                        )}
                    >
                        All Modules
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                                currentCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:flex whitespace-nowrap">
                    <Filter className="h-3 w-3" />
                    <span>Filter Catalog</span>
                </div>
            </div>
        </div>
    );
}
