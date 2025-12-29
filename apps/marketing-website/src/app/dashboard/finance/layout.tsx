import React from "react";
import Link from "next/link";
import { ChevronRight, Calculator, FileText, Webhook, Settings } from "lucide-react";

interface FinanceLayoutProps {
    children: React.ReactNode;
}

/**
 * Finance Dashboard Layout
 * Provides consistent navigation and structure for all finance pages
 */
export default function FinanceLayout({ children }: FinanceLayoutProps) {
    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Finance</span>
            </nav>

            {/* Sub-Navigation */}
            <div className="flex items-center gap-1 border-b border-border pb-4">
                <NavLink href="/dashboard/finance" icon={Calculator}>
                    Overview
                </NavLink>
                <NavLink href="/dashboard/finance/journal" icon={FileText}>
                    Journal
                </NavLink>
                <NavLink href="/dashboard/finance/stripe" icon={Webhook}>
                    Stripe Sync
                </NavLink>
                <NavLink href="/dashboard/finance/reports" icon={FileText}>
                    Reports
                </NavLink>
            </div>

            {/* Page Content */}
            {children}
        </div>
    );
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
}

function NavLink({ href, children, icon: Icon }: NavLinkProps) {
    // Note: In a real implementation, we'd use usePathname() to determine active state
    // For now, we'll rely on the page itself to handle active states
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
            {Icon && <Icon className="h-4 w-4" />}
            {children}
        </Link>
    );
}
