'use client';

import { CheckSquare, ShoppingCart, ShoppingBag, CreditCard, Building2, Laptop, Video, GraduationCap } from 'lucide-react';

interface Module {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
}

interface ModuleSelectorProps {
    modules: any[];
    activeModuleIds: string[];
    onToggleModule: (id: string) => void;
}

export function ModuleSelector({ modules, activeModuleIds, onToggleModule }: ModuleSelectorProps) {

    const getIcon = (iconName: string | null) => {
        switch (iconName) {
            case 'store': return <ShoppingBag className="w-5 h-5" />;
            case 'shopping-cart': return <ShoppingCart className="w-5 h-5" />;
            case 'credit-card': return <CreditCard className="w-5 h-5" />;
            case 'saas': return <Laptop className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'building': return <Building2 className="w-5 h-5" />;
            case 'edu': return <GraduationCap className="w-5 h-5" />;
            default: return <CheckSquare className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h3 className="font-bold text-slate-900 mb-4">Add-On Packs</h3>
            <p className="text-sm text-slate-500 mb-6">Customize your checklist for your business model.</p>

            <div className="space-y-3">
                {modules.map(module => {
                    const isActive = activeModuleIds.includes(module.id);
                    return (
                        <button
                            key={module.id}
                            onClick={() => onToggleModule(module.id)}
                            className={`w-full flex items-start text-left gap-3 p-3 rounded-xl transition-all border ${isActive
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20'
                                : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                                }`}
                        >
                            <div className={`mt-0.5 p-2 rounded-lg ${isActive ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                {getIcon(module.icon)}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                                    {module.name}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                                    {module.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
