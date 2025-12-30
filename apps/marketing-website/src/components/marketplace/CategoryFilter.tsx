"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModuleCategory } from "@/lib/marketplace/types";

interface CategoryFilterProps {
    categories: ModuleCategory[];
    selectedCategory: ModuleCategory;
    onSelectCategory: (category: ModuleCategory) => void;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    return (
        <div className="flex gap-2 p-1 bg-muted/30 rounded-full w-fit">
            {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200",
                            isSelected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-primary rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{category}</span>
                    </button>
                );
            })}
        </div>
    );
}
