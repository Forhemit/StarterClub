"use client";

import Link from "next/link";
import { Button } from "@starter-club/ui";
import { usePathname } from "next/navigation";
import { getAuthorizedNavigation, UserRole } from "@/lib/modules";
import "@/lib/plugins/marketing";
import "@/lib/plugins/flight-deck";
import "@/lib/plugins/system";

export function Sidebar({ userRole = "admin" }: { userRole?: UserRole }) {
    const pathname = usePathname();
    const navItems = getAuthorizedNavigation([userRole]); // TODO: Get real user role from auth

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
            <div className="mb-8 p-4 flex items-center gap-2">
                <img
                    src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                    alt="Starter Club Logo"
                    className="w-8 h-8 rounded-sm object-contain"
                />
                <h1 className="text-xl font-bold">Super Admin</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-800">
                <div className="px-4 py-2 text-xs text-gray-500 space-y-1">
                    <div className="font-mono uppercase tracking-widest opacity-75">
                        {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                    </div>
                    <div>Role: {userRole}</div>
                </div>
            </div>
        </aside>
    );
}
