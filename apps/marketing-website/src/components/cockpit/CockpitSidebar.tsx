"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShieldCheck,
    Database,
    Activity,
    Users,
    Settings,
    LogOut,
    Car
} from "lucide-react";
import { StatusGauge } from "./StatusGauge";

const sidebarItems = [
    {
        title: "The Cockpit",
        href: "/cockpit",
        icon: LayoutDashboard,
    },
    {
        title: "Chassis Spec",
        href: "/cockpit/chassis",
        icon: ShieldCheck,
    },
    {
        title: "Paddock Vault",
        href: "/cockpit/vault",
        icon: Database,
    },
    {
        title: "The Simulator",
        href: "/cockpit/simulator",
        icon: Activity,
    },
    {
        title: "Crew Chief",
        href: "/cockpit/crew",
        icon: Users,
    },
];

export function CockpitSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
            <div className="flex h-full flex-col">
                {/* Header - Branding */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link href="/cockpit" className="flex items-center gap-2">
                        <Car className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold tracking-tight text-foreground uppercase">
                            The Race Track
                        </span>
                    </Link>
                </div>

                {/* Global Status - Resilience Gauge */}
                <div className="p-6 border-b border-border bg-background/50">
                    <div className="mb-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Resilience Status
                    </div>
                    <StatusGauge status="wood" label="Wood Class (Caution)" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_0_theme(colors.primary.DEFAULT)]"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Settings & Logout */}
                <div className="border-t border-border p-3">
                    <Link
                        href="/cockpit/settings"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                    <button className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                        <LogOut className="h-5 w-5" />
                        Eject (Log out)
                    </button>
                </div>
            </div>
        </aside>
    );
}
