export type ModuleCategory = "Foundation" | "Operations" | "Growth" | "Business Resilience" | "All";

export interface MarketplaceModule {
    id: string;
    title: string;
    description: string;
    category: ModuleCategory;
    iconName: string; // Lucide icon name
    version: string;
    author: string;
    price: "Free" | "Premium" | "Enterprise";
    installed?: boolean;
    features: string[];
    longDescription?: string;
    screenshots?: string[];
    lastUpdated?: string;
    createdDate?: string;
}
