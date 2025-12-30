import { MarketplaceModule } from "@/lib/marketplace/types";
import { ModuleCard } from "./ModuleCard";
import { motion } from "framer-motion";

interface ModuleGridProps {
    modules: MarketplaceModule[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
    if (modules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground mb-4">No modules found in this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
            ))}
        </div>
    );
}
