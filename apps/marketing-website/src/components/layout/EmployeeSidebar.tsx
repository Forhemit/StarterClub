'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { getUserRoleConfig } from '@/lib/roles';
import { Calendar, Users, Megaphone, PlusCircle, Clock, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function EmployeeSidebar() {
    const { user, role } = useUser();
    const roleConfig = getUserRoleConfig(role);
    const pathname = usePathname();

    const companyWideItems = [
        {
            label: 'Events',
            icon: Calendar,
            children: [
                { label: 'Upcoming Events', href: '/events/upcoming', icon: Clock },
                { label: 'Calendar View', href: '/events/calendar', icon: LayoutGrid },
                { label: 'Create Event', href: '/events/create', icon: PlusCircle },
            ]
        },
        { label: 'Company Directory', href: '/directory', icon: Users },
        { label: 'Announcements', href: '/announcements', icon: Megaphone }
    ];

    return (
        <aside className="w-64 bg-background border-r h-screen overflow-y-auto flex flex-col sticky top-0">
            <div className="p-6 border-b">
                <h3 className="font-bold text-lg tracking-tight">Company Menu</h3>
            </div>

            {/* Company-wide items */}
            <nav className="p-4 space-y-1 flex-1">
                {companyWideItems.map((item) => (
                    <div key={item.label} className="mb-6">
                        <div className="flex items-center gap-2 px-2 pb-2 text-sm font-semibold text-muted-foreground">
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </div>
                        {item.children ? (
                            <div className="ml-4 space-y-1 mt-1 border-l pl-2">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                            pathname === child.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                                        )}
                                    >
                                        {child.icon && <child.icon className="h-3 w-3" />}
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ml-4",
                                    pathname === item.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}

                {/* Role-specific items */}
                {roleConfig.sidebarItems.length > 0 && (
                    <div className="mt-8 pt-4 border-t">
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3 px-2">
                            {roleConfig.displayName} Tools
                        </h3>
                        <div className="space-y-1">
                            {roleConfig.sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                        pathname === item.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <div className="p-4 border-t bg-muted/20">
                <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/events/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Quick Event
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
