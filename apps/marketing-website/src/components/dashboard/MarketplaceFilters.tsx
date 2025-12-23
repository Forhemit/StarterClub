'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MarketplaceFiltersProps {
    categories: string[];
}

export function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategory = searchParams.get('category') || 'all';

    const handleFilter = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'all') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilter('all')}
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
                        onClick={() => handleFilter(cat)}
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
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:flex">
                <Filter className="h-3 w-3" />
                <span>Filter Catalog</span>
            </div>
        </div>
    );
}
