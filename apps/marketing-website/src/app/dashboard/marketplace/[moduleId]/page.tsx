"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MARKETPLACE_MODULES } from "@/lib/marketplace/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Download, Package, ShieldCheck, Zap } from "lucide-react";
import { Scale, Landmark, Users, CalendarCheck, Truck, TrendingUp, Briefcase, DollarSign, CreditCard, Building2, BriefcaseBusiness, ClipboardCheck, Siren } from "lucide-react";

// Icon mapping (should ideally be shared)
const IconMap: { [key: string]: any } = {
    Scale, Landmark, Users, CalendarCheck, Truck, ShieldCheck,
    TrendingUp, Briefcase, DollarSign, Package, CreditCard, Building2,
    BriefcaseBusiness, ClipboardCheck, Siren
};

export default function ModuleDetailPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = use(params);
    const module = MARKETPLACE_MODULES.find((m) => m.id === moduleId);
    if (!module) {
        notFound();
    }

    const { toast } = useToast();
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(module.installed || false);

    const Icon = IconMap[module.iconName] || Package;

    // Check installation status on mount (this should ideally be passed from server component)
    // For now we'll assume the prop is initial source (which might be stale if we relied on static array)
    // A better approach in Next.js 15 is fetching this state in the server component.
    // However, since we are in a client component, let's just proceed with the action.

    const handleInstall = async () => {
        setIsInstalling(true);

        try {
            const { installModule } = await import("@/actions/marketplace");
            // module is guaranteed to be defined here due to the check above
            const result = await installModule(module.id);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Installation Failed",
                    description: result.error,
                });
            } else {
                setIsInstalled(true);
                toast({
                    title: "Module Installed",
                    description: `${module.title} has been successfully added to your dashboard.`,
                    duration: 5000,
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            });
        } finally {
            setIsInstalling(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back Link */}
            <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <Icon className="w-16 h-16 text-primary" />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold font-display tracking-tight">{module.title}</h1>
                        <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
                            {module.category}
                        </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {module.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <span>v{module.version}</span>
                        <span>•</span>
                        <span>{module.author}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                    {isInstalled ? (
                        <Button variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" disabled>
                            <Check className="w-4 h-4 mr-2" />
                            Installed
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full shadow-lg hover:shadow-xl transition-all"
                            onClick={handleInstall}
                            disabled={isInstalling}
                        >
                            {isInstalling ? (
                                <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    Installing...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Install {module.price === "Free" ? "" : `for ${module.price}`}
                                </>
                            )}
                        </Button>
                    )}
                    {module.price !== "Free" && !isInstalled && (
                        <p className="text-xs text-center text-muted-foreground">
                            Includes 14-day free trial
                        </p>
                    )}
                </div>
            </div>

            <Separator />

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">About this Module</h2>
                        <p className="leading-relaxed text-muted-foreground">
                            {module.longDescription || module.description}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">What's Included</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {module.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                Security & Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                Role-Level Security (RLS)
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                Encrypted Data
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                Audit Logging
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Automatically integrates with your Member Dashboard and Super Admin Playbooks upon installation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
