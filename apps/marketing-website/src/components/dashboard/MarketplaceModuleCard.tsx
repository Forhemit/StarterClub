'use client';

import { useState, useTransition } from 'react';
import { Package, CheckCircle, ArrowRight, Trash2, ChevronDown, ChevronUp, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { installModule, activateModule, uninstallModule } from '@/app/actions/marketplace';
import { cn } from '@/lib/utils';

interface MarketplaceModuleCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: any;
    businessId: string;
    status: 'active' | 'staged' | 'none';
}

export function MarketplaceModuleCard({ module, businessId, status }: MarketplaceModuleCardProps) {
    const [isPending, startTransition] = useTransition();
    const [showDetails, setShowDetails] = useState(false);

    const handleInstall = () => {
        startTransition(async () => {
            await installModule(businessId, module.id);
        });
    };

    const handleActivate = () => {
        startTransition(async () => {
            await activateModule(businessId, module.id);
        });
    };

    const handleUninstall = () => {
        startTransition(async () => {
            await uninstallModule(businessId, module.id);
        });
    };

    return (
        <div className={cn(
            "group bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col",
            status === 'active' && "border-green-200/50 shadow-green-500/5",
            status === 'staged' && "border-amber-200/50 shadow-amber-500/5"
        )}>
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                        status === 'active' ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                        <Package className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2">
                        {status === 'active' && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 gap-1 px-2.5 py-0.5">
                                <CheckCircle className="h-3 w-3" />
                                Installed
                            </Badge>
                        )}
                        {status === 'staged' && (
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 gap-1 px-2.5 py-0.5">
                                <AlertCircle className="h-3 w-3" />
                                Action Required
                            </Badge>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{module.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {module.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {module.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 border border-border px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full justify-between text-xs text-muted-foreground hover:text-foreground h-8"
                >
                    {showDetails ? 'Hide Details' : 'View Dependencies & Info'}
                    {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>

                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Version</h4>
                                <p className="text-xs font-mono text-foreground">{module.latest_version || '1.0.0'}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Dependencies</h4>
                                {module.dependencies?.length > 0 ? (
                                    <ul className="space-y-1">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {module.dependencies.map((dep: any) => (
                                            <li key={dep} className="text-xs flex items-center gap-1.5 text-foreground">
                                                <Package className="h-3 w-3 text-muted-foreground" />
                                                {dep}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No external dependencies.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 bg-muted/30 border-t border-border mt-auto flex flex-col gap-2">
                {status === 'none' ? (
                    <Button
                        onClick={handleInstall}
                        disabled={isPending}
                        className="w-full justify-between items-center h-10 font-bold tracking-tight shadow-sm"
                    >
                        {isPending ? 'Installing...' : 'Install Module'}
                        {!isPending && <ArrowRight className="h-4 w-4" />}
                    </Button>
                ) : status === 'staged' ? (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleActivate}
                            disabled={isPending}
                            className="flex-1 font-bold tracking-tight bg-primary hover:bg-primary/90"
                        >
                            {isPending ? 'Activating...' : 'Activate Now'}
                        </Button>
                        <Button
                            onClick={handleUninstall}
                            disabled={isPending}
                            variant="outline"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleUninstall}
                        disabled={isPending}
                        variant="outline"
                        className="w-full font-bold tracking-tight text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all"
                    >
                        {isPending ? 'Uninstalling...' : 'Uninstall Module'}
                    </Button>
                )}
            </div>
        </div>
    );
}
