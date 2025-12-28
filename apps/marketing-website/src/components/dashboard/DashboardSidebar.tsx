"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    LayoutDashboard, BookOpen, Users, Calculator, Library, FileText, Package, Send, BarChart, ShieldCheck, Menu, CheckSquare, Settings, Hammer, Sparkles, Building2,
    Home, LogOut, Compass, ChevronRight
} from "lucide-react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { useState, useMemo, useEffect } from "react";
import { DashboardThemeToggle } from "./DashboardThemeToggle";
import { getUserNavItems, NavItem } from "@/actions/rbac";
import { ProfileSettingsModal } from "./ProfileSettingsModal";

// Map string icon names to Lucide components
const IconMap: { [key: string]: any } = {
    LayoutDashboard, BookOpen, Users, Calculator, Library, FileText, Package, Send, BarChart,
    ShieldCheck, Menu, CheckSquare, Settings, Hammer, Sparkles, Building2, Home, LogOut, Compass
};

// Section icons for accordion headers
const SectionIconMap: { [key: string]: any } = {
    "Main": LayoutDashboard,
    "Partner": Users,
    "Sponsor": Sparkles,
    "Admin": ShieldCheck,
    "Finance": Calculator,
    "HR": Building2,
    "Settings": Settings,
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
    onLinkClick?: () => void;
}

export function DashboardSidebar({ className, mobile, onLinkClick }: SidebarProps) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>(['member']);

    useEffect(() => {
        if (!isLoaded || !user) return;

        async function fetchNav() {
            try {
                const items = await getUserNavItems(user?.id);
                setNavItems(items);
            } catch (error) {
                console.error("Failed to load nav items", error);
            } finally {
                setLoading(false);
            }
        }

        fetchNav();
    }, [isLoaded, user]);

    // Group items by section
    const groupedItems = useMemo(() => {
        const groups: { [key: string]: NavItem[] } = {};

        navItems.forEach(item => {
            const section = item.section || "Main";
            if (!groups[section]) groups[section] = [];
            groups[section].push(item);
        });

        return groups;
    }, [navItems]);

    // Get sections with active items for default open state
    const defaultOpenSections = useMemo(() => {
        const activeSection = Object.entries(groupedItems).find(([_, items]) =>
            items.some(item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard'))
        );
        return activeSection ? [activeSection[0], "Main"] : ["Main"];
    }, [groupedItems, pathname]);

    return (
        <div className={cn(
            "pb-12 h-full bg-gradient-to-b from-card via-card to-card/95 text-card-foreground",
            "border-r border-border/50",
            className
        )}>
            <div className="space-y-2 py-4 h-full flex flex-col">
                {/* Logo Header */}
                {!mobile && (
                    <div className="px-4 py-3 border-b border-border/30 mx-3 mb-2">
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <img
                                    src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                                    alt="Starter Club Logo"
                                    className="h-9 w-9 object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-primary/20 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-primary font-bebas">
                                    STARTER CLUB
                                </h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                    {loading ? "Loading..." : "Unified Dashboard"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation with Accordion */}
                <ScrollArea className="flex-1 px-2">
                    {loading ? (
                        <div className="p-4 text-sm text-muted-foreground animate-pulse">
                            Loading navigation...
                        </div>
                    ) : (
                        <Accordion
                            type="multiple"
                            defaultValue={defaultOpenSections}
                            className="w-full space-y-1"
                        >
                            {Object.entries(groupedItems).map(([section, items]) => {
                                const SectionIcon = SectionIconMap[section] || LayoutDashboard;
                                const hasActiveItem = items.some(item =>
                                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                                );

                                return (
                                    <AccordionItem
                                        key={section}
                                        value={section}
                                        className="border-none"
                                    >
                                        <AccordionTrigger
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm font-medium",
                                                "hover:no-underline hover:bg-accent/50",
                                                "transition-all duration-200",
                                                "[&[data-state=open]]:bg-accent/30",
                                                "[&>svg]:transition-transform [&>svg]:duration-200",
                                                hasActiveItem && "text-primary"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <SectionIcon className={cn(
                                                    "h-4 w-4",
                                                    hasActiveItem ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                <span className="uppercase tracking-wider text-xs">
                                                    {section}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pb-2">
                                            <div className="space-y-0.5 ml-2 border-l border-border/30 pl-2">
                                                {items.map((link) => {
                                                    const Icon = IconMap[link.iconName] || LayoutDashboard;
                                                    const isActive = pathname === link.href ||
                                                        (pathname.startsWith(link.href) && link.href !== '/dashboard');

                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={onLinkClick}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "w-full justify-start gap-2 h-9",
                                                                    "transition-all duration-200",
                                                                    "hover:translate-x-1 hover:bg-accent/50",
                                                                    isActive && [
                                                                        "bg-primary/10 text-primary font-medium",
                                                                        "border-l-2 border-primary -ml-[2px]",
                                                                        "hover:bg-primary/15"
                                                                    ]
                                                                )}
                                                            >
                                                                <Icon className={cn(
                                                                    "h-4 w-4 shrink-0",
                                                                    isActive ? "text-primary" : "text-muted-foreground"
                                                                )} />
                                                                <span className="truncate">{link.label}</span>
                                                                {isActive && (
                                                                    <ChevronRight className="h-3 w-3 ml-auto text-primary/60" />
                                                                )}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </ScrollArea>

                {/* Footer Actions */}
                <div className="px-3 mt-auto border-t border-border/30 pt-4 mx-2 space-y-3">
                    <DashboardThemeToggle />

                    <div className="grid grid-cols-3 gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            className="w-full h-9 flex-col gap-0.5 text-[10px] hover:bg-accent/50 hover:text-primary transition-all duration-200"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </Button>
                        <Link href="/" title="Go to Website">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-9 flex-col gap-0.5 text-[10px] hover:bg-accent/50 hover:text-primary transition-all duration-200"
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Button>
                        </Link>
                        <SignOutButton>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-9 flex-col gap-0.5 text-[10px] hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Exit</span>
                            </Button>
                        </SignOutButton>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/20 border border-border/30">
                        <UserButton afterSignOutUrl="/" />
                        <div className="text-xs flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.fullName || "User"}</p>
                            <p className="text-muted-foreground truncate text-[10px]">
                                {user?.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Settings Modal */}
            <ProfileSettingsModal
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                profile={null}
                userRoles={userRoles}
                hasSubscription={false}
            />
        </div>
    );
}

// Mobile Navigation Sheet
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
            <SheetContent side="left" className="p-0 w-72 bg-card">
                <SheetHeader className="px-6 py-4 border-b border-border/30 text-left">
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
    );
}
