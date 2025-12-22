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
                <div className="flex h-screen overflow-hidden bg-slate-50">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:flex w-72 flex-col border-r border-slate-200 bg-white shadow-sm z-20">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-bold text-xl tracking-tight text-blue-600">Starter Club</span>
                        </div>
                        <DashboardSidebar role="partner" className="border-none" />
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Mobile Header */}
                        <header className="md:hidden flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm z-10">
                            <DashboardMobileNav role="partner" />
                            <div className="font-semibold text-lg">Starter Club</div>
                            <div className="ml-auto">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn afterSignInUrl="/dashboard/partner/foundation" />
            </SignedOut>
        </>
    );
}
