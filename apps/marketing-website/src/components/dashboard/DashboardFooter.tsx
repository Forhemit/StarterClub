"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Home, LayoutDashboard, User, Settings, Database, Shield } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

type DashboardRole = "partner" | "partner_admin" | "super_admin";

interface DashboardFooterProps {
    role?: DashboardRole;
    className?: string;
}

export function DashboardFooter({ role = "partner", className }: DashboardFooterProps) {
    const pathname = usePathname();

    const commonLinks = [
        { href: "/", label: "Main Website", icon: Home },
        { href: "/support", label: "Support", icon: User }, // Placeholder
    ];

    const partnerLinks = [
        { href: "/dashboard/partner", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/partner/resources", label: "Resources", icon: Database },
        { href: "/dashboard/partner/profile", label: "Profile", icon: Settings }, // Placeholder
    ];

    const partnerAdminLinks = [
        { href: "/dashboard/partner-admin", label: "Admin Home", icon: LayoutDashboard },
        { href: "/dashboard/partner-admin/team", label: "Manage Team", icon: User }, // Placeholder
        { href: "/dashboard/partner-admin/settings", label: "Settings", icon: Settings }, // Placeholder
    ];

    const superAdminLinks = [
        { href: "/dashboard/super-admin", label: "Super Admin", icon: Shield },
        { href: "/dashboard/super-admin/users", label: "Users", icon: User },
        { href: "/dashboard/super-admin/logs", label: "Audit Logs", icon: Database },
    ];

    let activeLinks = partnerLinks;
    if (role === "partner_admin") activeLinks = partnerAdminLinks;
    if (role === "super_admin") activeLinks = superAdminLinks;

    return (
        <footer className={cn("bg-white border-t py-8 px-6 mt-auto", className)}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="font-bebas text-xl text-[var(--accent)]">STARTER CLUB SF</h3>
                    <p className="text-xs text-muted-foreground">
                        Empowering the builders, creators, and founders of San Francisco.
                    </p>
                </div>

                {/* Sitemap */}
                <div className="col-span-2 grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Portal Navigation</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {activeLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-[var(--accent)] flex items-center gap-2">
                                        <link.icon className="h-3 w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {commonLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-[var(--accent)] flex items-center gap-2">
                                        <link.icon className="h-3 w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* User / Actions */}
                <div className="flex flex-col items-start md:items-end">
                    <div className="mb-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 px-2 py-1 rounded">
                            {role.replace("_", " ")}
                        </span>
                    </div>
                    <SignOutButton>
                        <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 pt-4 border-t text-center text-[10px] text-gray-400">
                &copy; {new Date().getFullYear()} Starter Club SF. All rights reserved.
            </div>
        </footer>
    );
}
