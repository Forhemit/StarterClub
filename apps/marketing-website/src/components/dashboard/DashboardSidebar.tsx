"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    LayoutDashboard, BookOpen, Users, Calculator, Library, FileText, Package, Send, BarChart, ShieldCheck, Menu, Database, Flag, CheckSquare
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

type DashboardRole = "partner" | "partner_admin" | "super_admin";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
    onLinkClick?: () => void;
    role?: DashboardRole;
}

export function DashboardSidebar({ className, mobile, onLinkClick, role = "partner" }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useUser();

    // Define links for each role
    const links = {
        partner: [
            { href: "/dashboard/partner", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/partner/story", label: "Our Story", icon: BookOpen },
            { href: "/dashboard/partner/intros", label: "Intros", icon: Users },
            { href: "/dashboard/partner/foundation", label: "Foundation", icon: CheckSquare },
            { href: "/dashboard/partner/roi", label: "ROI Lab", icon: Calculator },
            { href: "/dashboard/partner/resources", label: "Resources", icon: Library },
            { href: "/dashboard/partner/case-studies", label: "Case Studies", icon: FileText },
            { href: "/dashboard/partner/packages", label: "Packages", icon: Package },
            { href: "/dashboard/partner/actions", label: "Actions", icon: Send },
            { href: "/dashboard/partner/reports", label: "Reports", icon: BarChart },
        ],
        partner_admin: [
            { href: "/dashboard/partner-admin", label: "Overview", icon: LayoutDashboard },
            { href: "/dashboard/partner-admin/team", label: "Team", icon: Users },
            { href: "/dashboard/partner-admin/settings", label: "Settings", icon: Package }, // reuse icon
        ],
        super_admin: [
            { href: "/dashboard/super-admin", label: "Admin Overview", icon: ShieldCheck },
            { href: "/dashboard/super-admin/users", label: "Users & Orgs", icon: Users },
            { href: "/dashboard/super-admin/resources", label: "Resources", icon: Library },
            { href: "/dashboard/super-admin/case-studies", label: "Case Studies", icon: FileText },
            { href: "/dashboard/super-admin/submissions", label: "Submissions", icon: Send },
            { href: "/dashboard/super-admin/flags", label: "Content Flags", icon: Flag },
        ]
    };

    const currentLinks = links[role] || links.partner;

    return (
        <div className={cn("pb-12 h-full bg-white", className)}>
            <div className="space-y-4 py-4 h-full flex flex-col">
                {!mobile && (
                    <div className="px-4 py-2 border-b border-black/5 mx-4 mb-4">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                                alt="Starter Club Logo"
                                className="h-8 w-8 object-contain rounded-sm"
                            />
                            <h2 className="text-xl font-bold tracking-tight text-[var(--accent)] font-bebas">
                                STARTER CLUB
                            </h2>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{role.replace("_", " ")} Portal</p>
                    </div>
                )}

                <ScrollArea className="flex-1 px-3">
                    <div className="space-y-1">
                        {currentLinks.map((link) => {
                            const Icon = link.icon;
                            // Active if exact match OR starts with dashboard path (except exact root dashboard collision)
                            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${role.replace("_", "-")}`);
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

                <div className="px-4 mt-auto border-t border-black/5 pt-4 mx-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground opacity-50 text-center">
                        {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                    </div>
                    <div className="flex items-center gap-3">
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
export function DashboardMobileNav({ role = "partner" }: { role?: DashboardRole }) {
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
                        <SheetTitle className="text-[var(--accent)] font-bebas text-xl">STARTER CLUB</SheetTitle>
                    </div>
                </SheetHeader>
                <DashboardSidebar role={role} mobile onLinkClick={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}
