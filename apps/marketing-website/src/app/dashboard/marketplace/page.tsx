"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKETPLACE_MODULES as MODULES } from "@/lib/marketplace/data";
import { ModuleCategory } from "@/lib/marketplace/types";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { ModuleGrid } from "@/components/marketplace/ModuleGrid";
import { motion } from "framer-motion";

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("az");

    const categories: ModuleCategory[] = ["All", "Foundation", "Operations", "Growth", "Business Resilience"];

    const [modules, setModules] = useState<typeof MODULES>(MODULES);

    // Fetch installed modules and their updated dates
    useEffect(() => {
        // We'll fetch the dynamic data and merge it with static data
        /* 
           Note: We cannot import the server action directly here if this was a purely static component, 
           but since it's "use client", we can call server actions.
        */
        const fetchStatus = async () => {
            try {
                // Dynamic import to avoid server-on-client issues if any
                const { getInstalledModules } = await import("@/actions/marketplace");
                const { data } = await getInstalledModules();

                if (data && data.length > 0) {
                    setModules(prev => prev.map(m => {
                        const installed = data.find((i: any) => i.module_id === m.id);
                        if (installed) {
                            return {
                                ...m,
                                installed: true
                            };
                        }
                        return m;
                    }));
                }
            } catch (e) {
                console.error("Failed to fetch module status", e);
            }
        };

        fetchStatus();
    }, []);

    const filteredModules = modules.filter((module) => {
        // Category Filter
        if (selectedCategory !== "All" && module.category !== selectedCategory) return false;

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                module.title.toLowerCase().includes(query) ||
                module.description.toLowerCase().includes(query)
            );
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === "az") {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === "latest") {
            // Use lastUpdated if available, else version
            if (a.lastUpdated && b.lastUpdated) {
                return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            }
            return b.version.localeCompare(a.version);
        }
        if (sortBy === "popular") {
            // Mock popular: prioritize "Foundation" or by feature count
            return b.features.length - a.features.length;
        }
        return 0;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                <div className="flex items-center gap-2">
                    <div className="relative">
                        {!searchQuery && (
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-[200px] h-9 bg-muted/30 border-none shadow-none focus-visible:ring-1",
                                searchQuery ? "pl-3 pr-8" : "pl-9"
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-none shadow-none focus:ring-1">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium">Sort by</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="az">A - Z</SelectItem>
                            <SelectItem value="latest">Latest Activity</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <motion.div
                key={selectedCategory + sortBy + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ModuleGrid modules={filteredModules} />
            </motion.div>
        </div>
    );
}
