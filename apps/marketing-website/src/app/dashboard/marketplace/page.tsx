"use client";

import { useState } from "react";

import { MARKETPLACE_MODULES as MODULES } from "@/lib/marketplace/data";
import { ModuleCategory } from "@/lib/marketplace/types";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { ModuleGrid } from "@/components/marketplace/ModuleGrid";
import { motion } from "framer-motion";

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>("All");

    const categories: ModuleCategory[] = ["All", "Foundation", "Operations", "Growth", "Business Resilience"];

    const filteredModules = MODULES.filter((module) => {
        if (selectedCategory === "All") return true;
        return module.category === selectedCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ModuleGrid modules={filteredModules} />
            </motion.div>
        </div>
    );
}
