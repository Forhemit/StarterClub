import { getMarketplaceModules, installModule, activateModule, uninstallModule } from '@/app/actions/marketplace';
import { getChecklistData } from '@/app/actions/checklist';
import { Package, Search, CheckCircle, ArrowRight, Star, Trash2, Flashlight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default async function MarketplacePage() {
    const modules = await getMarketplaceModules();
    const { business, activeModuleIds, stagedModuleIds } = await getChecklistData();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Foundation Builders Marketplace</h1>
                    <p className="text-slate-500 mt-1">Plug-and-play modules to power your business operations.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Certified Modules</span>
                </div>
            </div>

            <div className="relative mb-8 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-10 h-11 text-base shadow-sm" placeholder="Search modules (Legal, CRM, E-Commerce...)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((module) => {
                    const isActive = activeModuleIds.includes(module.id);
                    const isStaged = stagedModuleIds.includes(module.id);
                    const isInstalled = isActive || isStaged;

                    return (
                        <div key={module.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300`}>
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        {isActive && (
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1 px-2">
                                                <CheckCircle className="h-3 w-3" />
                                                Active
                                            </Badge>
                                        )}
                                        {isStaged && (
                                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 gap-1 px-2">
                                                <Package className="h-3 w-3" />
                                                Staged
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{module.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                    {module.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {module.tags?.map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100 px-2 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 bg-slate-50/50 border-t border-slate-100 mt-auto flex flex-col gap-2">
                                {!isInstalled ? (
                                    <form action={async () => {
                                        'use server'
                                        await installModule(business.id, module.id);
                                    }}>
                                        <Button
                                            type="submit"
                                            className="w-full justify-between items-center h-11 font-bold tracking-tight"
                                        >
                                            Install Module
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </form>
                                ) : isStaged ? (
                                    <div className="flex gap-2">
                                        <form className="flex-1" action={async () => {
                                            'use server'
                                            await activateModule(business.id, module.id);
                                        }}>
                                            <Button
                                                type="submit"
                                                variant="default"
                                                className="w-full font-bold tracking-tight bg-blue-600 hover:bg-blue-700"
                                            >
                                                Activate
                                            </Button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await uninstallModule(business.id, module.id);
                                        }}>
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="px-3 border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                ) : (
                                    <form action={async () => {
                                        'use server'
                                        await uninstallModule(business.id, module.id);
                                    }}>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="w-full font-bold tracking-tight text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                                        >
                                            Uninstall Module
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
