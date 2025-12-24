import { getModulesAction } from '@/app/actions/marketplace';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Box, Layers, Activity } from 'lucide-react';
import { MarketplaceToolbar } from './MarketplaceToolbar';

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await searchParams before using properties
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const type = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : undefined;

    const { data: modules, success, error } = await getModulesAction({ search, type });

    if (!success) {
        return <div className="p-8 text-red-500">Error loading modules: {error}</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/marketplace/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Module
                        </Button>
                    </Link>
                </div>
            </div>

            <MarketplaceToolbar />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules?.map((module: any) => (
                    <Link href={`/marketplace/${module.id}`} key={module.id}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                                    {module.module_type}
                                </div>
                                {module.module_type === 'industry' ? <Box className="h-4 w-4 text-muted-foreground" /> :
                                    module.module_type === 'submodule' ? <Layers className="h-4 w-4 text-muted-foreground" /> :
                                        <Activity className="h-4 w-4 text-muted-foreground" />}
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold mb-2">{module.name}</div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {module.description || "No description"}
                                </p>
                                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                                    <div>v{module.version}</div>
                                    <div>{module.installs?.[0]?.count || 0} installs</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {modules?.length === 0 && (
                    <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                        No modules found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
