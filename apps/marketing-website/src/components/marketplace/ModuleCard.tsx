"use client";

import { MarketplaceModule } from "@/lib/marketplace/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Scale, Landmark, Users, CalendarCheck, Truck, ShieldCheck,
    TrendingUp, Briefcase, DollarSign, Package, FolderLock, Check, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Icon mapping
const IconMap: { [key: string]: any } = {
    Scale, Landmark, Users, CalendarCheck, Truck, ShieldCheck,
    TrendingUp, Briefcase, DollarSign, Package, FolderLock
};

interface ModuleCardProps {
    module: MarketplaceModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
    const Icon = IconMap[module.iconName] || Package;

    return (
        <Link href={`/dashboard/marketplace/${module.id}`}>
            <Card className="h-full flex flex-col group hover:shadow-md transition-all duration-300 hover:border-primary/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity -rotate-12 translate-x-4 -translate-y-4">
                    <Icon className="w-24 h-24" />
                </div>

                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:scale-105 transition-transform duration-300">
                            <Icon className="w-6 h-6" />
                        </div>
                        {module.installed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100/80 border-0">
                                <Check className="w-3 h-3 mr-1" /> Installed
                            </Badge>
                        )}
                        {!module.installed && module.price !== "Free" && (
                            <Badge variant="outline" className="text-muted-foreground">
                                {module.price}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {module.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {module.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {module.features.slice(0, 2).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] font-normal opacity-80">
                                {feature}
                            </Badge>
                        ))}
                        {module.features.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] font-normal opacity-80">
                                +{module.features.length - 2} more
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-2 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
                    {module.lastUpdated ? (
                        <span>
                            v{module.version} • {new Date(module.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    ) : (
                        <span>v{module.version}</span>
                    )}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </CardFooter>
            </Card>
        </Link>
    );
}
