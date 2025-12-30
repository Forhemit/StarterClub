export type ModuleCategory = "Foundation" | "Operations" | "Growth" | "All";

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
}
