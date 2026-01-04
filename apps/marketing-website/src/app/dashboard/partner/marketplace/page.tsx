import { getMarketplaceModules } from '@/app/actions/marketplace';
import { getChecklistData } from '@/app/actions/checklist';
import { Star } from 'lucide-react';
import { MarketplaceModuleCard } from '@/components/dashboard/MarketplaceModuleCard';
import { MarketplaceFilters } from '@/components/dashboard/MarketplaceFilters';

interface MarketplacePageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        sort?: string;
    }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
    const params = await searchParams;
    const category = params.category || 'all';
    const search = params.search || '';
    const sort = params.sort || 'az';

    const modules = await getMarketplaceModules();
    const { business, activeModuleIds, stagedModuleIds } = await getChecklistData();

    // 1. Filter by Category and Search
    const filteredModules = modules.filter((mod) => {
        // Search Filter
        if (search && !mod.name.toLowerCase().includes(search.toLowerCase()) && !mod.description.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Category Filter
        if (category === 'all') return true;

        // Map common UI categories to DB types
        if (category === 'Industries' && mod.module_type === 'industry') return true;
        if (category === 'Functions' && mod.module_type === 'function') return true;
        if (category === 'Sub-Modules' && mod.module_type === 'submodule') return true;

        return false;
    });

    // 2. Sort Modules
    filteredModules.sort((a, b) => {
        if (sort === 'latest') {
            // Assuming created_at or similar exists, otherwise fallback to name
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
        }
        if (sort === 'popular') {
            // Mock popularity by installed count if available, or just random/persistent metric
            // For now, let's just use a placeholder or fallback to AZ if no metric
            return (b.install_count || 0) - (a.install_count || 0);
        }
        // Default AZ
        return a.name.localeCompare(b.name);
    });

    // 2. Derive Categories for the Filter Component
    // We'll hardcode the main ones for a better UX than raw DB values
    const categories = ['Industries', 'Functions', 'Sub-Modules'];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Module Registry</h1>
                    <p className="text-muted-foreground mt-1">Plug-and-play capabilities to power your business operations.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50/50 px-4 py-2 rounded-lg border border-blue-100/50">
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Certified Modules</span>
                </div>
            </div>

            <MarketplaceFilters categories={categories} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredModules.length > 0 ? (
                    filteredModules.map((module) => {
                        const isActive = activeModuleIds.includes(module.id);
                        const isStaged = stagedModuleIds.includes(module.id);

                        let status: 'active' | 'staged' | 'none' = 'none';
                        if (isActive) status = 'active';
                        else if (isStaged) status = 'staged';

                        return (
                            <MarketplaceModuleCard
                                key={module.id}
                                module={module}
                                businessId={business.id}
                                status={status}
                            />
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-2xl bg-muted/30">
                        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Star className="h-8 w-8 text-muted/30" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No modules found</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
                            Try adjusting your filters to see more results.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}