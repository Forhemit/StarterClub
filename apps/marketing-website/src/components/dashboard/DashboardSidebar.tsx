"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    LayoutDashboard, BookOpen, Users, Calculator, Library, FileText, Package, Send, BarChart, ShieldCheck, Menu, CheckSquare, Settings, Hammer, Sparkles, Building2,
    Home, LogOut
} from "lucide-react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { DashboardThemeToggle } from "./DashboardThemeToggle";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
    onLinkClick?: () => void;
}

export function DashboardSidebar({ className, mobile, onLinkClick }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useUser();
    const { roles, isLoading } = useUserRoles();

    // Define links for each role
    const linkDefinitions = useMemo(() => {
        const allLinks: { href: string; label: string; icon: any; section?: string }[] = [];

        // Common/Member Links
        if (roles.some(r => r.slug === 'member') || true) { // Always show member links for now? Or baseline
            allLinks.push(
                { href: "/dashboard", label: "Home Base", icon: LayoutDashboard },
                { href: "/builder", label: "Builder Rooms", icon: Hammer },
                { href: "/resources", label: "Playbooks", icon: BookOpen },
            );
        }

        // Partner Links
        if (roles.some(r => r.slug === 'partner' || r.slug === 'partner_admin')) {
            allLinks.push(
                { href: "/dashboard/partner", label: "Partner Overview", icon: Building2, section: "Partner" },
                { href: "/dashboard/partner/intros", label: "Intros", icon: Users, section: "Partner" },
                { href: "/dashboard/partner/roi", label: "ROI Lab", icon: Calculator, section: "Partner" },
            );
        }

        // Sponsor Links
        if (roles.some(r => r.slug === 'sponsor')) {
            allLinks.push(
                { href: "/dashboard/sponsor", label: "Campaigns", icon: Sparkles, section: "Sponsor" },
                { href: "/dashboard/sponsor/roi", label: "Growth Signals", icon: BarChart, section: "Sponsor" },
            );
        }

        // Employee/Admin Links (Simplified for now)
        if (roles.some(r => r.slug === 'employee' || r.slug === 'admin' || r.slug === 'super_admin')) {
            allLinks.push(
                { href: "/dashboard/super-admin", label: "Admin Console", icon: ShieldCheck, section: "Admin" },
            );
        }

        return allLinks;
    }, [roles]);

    return (
        <div className={cn("pb-12 h-full bg-card text-card-foreground", className)}>
            <div className="space-y-4 py-4 h-full flex flex-col">
                {!mobile && (
                    <div className="px-4 py-2 border-b border-border mx-4 mb-4">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                                alt="Starter Club Logo"
                                className="h-8 w-8 object-contain rounded-sm"
                            />
                            <h2 className="text-xl font-bold tracking-tight text-primary font-bebas">
                                STARTER CLUB
                            </h2>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                            {isLoading ? "Loading..." : "Unified Dashboard"}
                        </p>
                    </div>
                )}

                <ScrollArea className="flex-1 px-3">
                    <div className="space-y-1">
                        {linkDefinitions.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');

                            return (
                                <Link key={link.href} href={link.href} onClick={onLinkClick}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn("w-full justify-start", isActive && "font-semibold")}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {link.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </ScrollArea>

                <div className="px-4 mt-auto border-t border-border pt-4 mx-4 space-y-2">
                    <DashboardThemeToggle />

                    <div className="grid grid-cols-2 gap-2">
                        <Link href="/" title="Go to Website">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-border bg-card text-card-foreground hover:bg-muted px-2">
                                <Home className="h-4 w-4 shrink-0" />
                                <span className="truncate">Home</span>
                            </Button>
                        </Link>
                        <SignOutButton>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-border bg-card text-card-foreground hover:bg-muted px-2">
                                <LogOut className="h-4 w-4 shrink-0" />
                                <span className="truncate">Log Out</span>
                            </Button>
                        </SignOutButton>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <UserButton afterSignOutUrl="/" />
                        <div className="text-xs">
                            <p className="font-medium truncate max-w-[120px]">{user?.fullName || "User"}</p>
                            <p className="text-muted-foreground truncate max-w-[120px]">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for mobile nav that accepts role
export function DashboardMobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <SheetHeader className="px-6 py-4 border-b text-left">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                            alt="Starter Club Logo"
                            className="h-8 w-8 object-contain rounded-sm"
                        />
                        <SheetTitle className="text-primary font-bebas text-xl">STARTER CLUB</SheetTitle>
                    </div>
                </SheetHeader>
                <DashboardSidebar mobile onLinkClick={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}
