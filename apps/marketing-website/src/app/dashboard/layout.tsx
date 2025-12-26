import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/DashboardSidebar";
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SignedIn>
                <div className="flex h-screen overflow-hidden bg-muted/20 dark:bg-background">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:flex w-72 flex-col border-r border-border bg-card shadow-sm z-20">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <span className="font-bold text-xl tracking-tight text-primary font-display">Starter Club</span>
                        </div>
                        <DashboardSidebar className="border-none" />
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Mobile Header */}
                        <header className="md:hidden flex h-16 items-center gap-4 border-b border-border bg-card px-4 shadow-sm z-10">
                            <DashboardMobileNav />
                            <div className="font-semibold text-lg text-foreground">Starter Club</div>
                            <div className="ml-auto">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto bg-background/50 p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
