"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    LayoutDashboard,
    LogOut,
    Sun,
    Moon,
    Zap,
    Menu,
    X,
    Smartphone,
    Monitor,
    Rocket
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('racetrack'); // Cycling through custom theme
        else setTheme('light');
    };

    const isActive = (path: string) => pathname === path || pathname.startsWith(path);

    const NavItem = ({ href, icon: Icon, label, external }: { href: string; icon: any; label: string; external?: boolean }) => (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                isActive(href)
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
            {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </Link>
    );

    return (
        <aside className={cn(
            "flex flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 h-screen sticky top-0",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 h-16">
                {!collapsed && (
                    <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white truncate">
                        Starter Club
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                    {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                <NavItem href="/" icon={Home} label="Home" />
                <NavItem href="/employee-portal/selection" icon={LayoutDashboard} label="Role Selection" />

                <div className="my-4 border-t border-zinc-200 dark:border-zinc-800" />

                {!collapsed && <div className="px-3 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Apps</div>}

                {/* External App Links - Assuming ports based on standard Next.js behavior or user setup */}
                <NavItem href="http://localhost:3001" icon={Rocket} label="Super Admin" external />
                <NavItem href="http://localhost:3002" icon={Smartphone} label="Onboard App" external />
                <NavItem href="http://localhost:3003" icon={Monitor} label="Kiosk / Flight Deck" external />
            </div>

            <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                >
                    {mounted ? (theme === 'light' ? <Sun className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Zap className="w-5 h-5" />) : <Sun className="w-5 h-5" />}
                    {!collapsed && <span>Theme: {mounted ? theme : 'light'}</span>}
                </button>

                <Link
                    href="/"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span>Logout</span>}
                </Link>
            </div>
        </aside>
    );
};
